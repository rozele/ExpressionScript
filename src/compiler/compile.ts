/// <reference path="../../typings/globals/node/index.d.ts"/>

import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

import {
    ExpressionAstVisitor,
    isQuote,
} from './ExpressionAstVisitor';

import {ReifyingExpressionVisitor} from './ReifyingExpressionVisitor'

class AstExpressionVisitor {
    visit(node: ts.Node) {
        node
        ts.forEachChild(node, x => this.visit(x));
    }
}

class QuotedExpressionVisitor extends AstExpressionVisitor {
    private isInQuote: boolean = false;
    
    expressions: ts.TypeAssertion[] = [];

    visit(node: ts.Node) {
        let isQuoted = false;
        if (!this.isInQuote && (isQuoted = this.isQuotedAssertion(node))) {
            this.isInQuote = true;
            this.expressions.push(<ts.TypeAssertion>node);
        }

        super.visit(node);

        if (isQuoted) {
            this.isInQuote = false;
        }
    }

    private isQuotedAssertion(node: ts.Node): boolean {
        if (node.kind === ts.SyntaxKind.TypeAssertionExpression) {
            const expr = <ts.TypeAssertion>node;
            return isQuote(expr);
        }
        return false;
    }
}

export function compile(filePath: string) {
    const parsedPath = path.parse(filePath);
    const l = parsedPath.name.length;
    if (parsedPath.ext !== '.ts' || parsedPath.name.substring(l - 2) !== '.q' || l < 3) {
        console.error('Expected file name with extension .q.ts');
    }

    const unquotedName = parsedPath.name.substring(0, l - 2);
    const outputPath = path.format({
        root: parsedPath.root,
        base: undefined,
        dir: parsedPath.dir,
        ext: parsedPath.ext,
        name: unquotedName,
    });

    const sourceText = fs.readFileSync(filePath, 'utf8');
    const sourceFile = ts.createSourceFile(unquotedName + '.ts', sourceText, ts.ScriptTarget.Latest);
    const quoteVisitor = new QuotedExpressionVisitor();
    quoteVisitor.visit(sourceFile);
    
    var unquotedSourceText = "";
    var lastPos = 0;
    quoteVisitor.expressions.forEach(node => {
        const converter = new ExpressionAstVisitor(sourceText);
        const expression = converter.visit(node);
        const reified = new ReifyingExpressionVisitor().visit(expression);
        unquotedSourceText = unquotedSourceText + sourceText.substring(lastPos, node.pos) + reified;
        lastPos = node.end;
    });
    unquotedSourceText = unquotedSourceText + sourceText.substr(lastPos);

    fs.writeFileSync(outputPath, unquotedSourceText);
}