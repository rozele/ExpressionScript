import * as ts from 'typescript';
import {
    Expression,
    LambdaExpression,
    ParameterExpression,
} from '../expressions/Expression';
import {CompilerExpression} from './CompilerExpressions';
import {AstVisitor} from './AstVisitor';

export function isQuote(node: ts.TypeAssertion) {
    if (node.kind === ts.SyntaxKind.TypeAssertionExpression) {
        const expr = <ts.TypeAssertion>node;
        return isFunctionLike(expr.expression)
            && isLambdaExpressionType(expr.type);
    }
    return false;
}

function isFunctionLike(node: ts.Node): boolean {
    // TODO: support other encapsulations of functions
    if (node.kind === ts.SyntaxKind.ParenthesizedExpression) {
        const expr = <ts.ParenthesizedExpression>node;
        return isFunctionLike(expr.expression);
    }
    // TODO: support other kinds of functions
    return node.kind === ts.SyntaxKind.ArrowFunction;
}

function isLambdaExpressionType(node: ts.TypeNode): boolean {
    // TODO: support other kinds of types
    if (node.kind === ts.SyntaxKind.TypeReference) {
        const typeRef = <ts.TypeReferenceNode>node;
        if (typeRef.typeName.kind === ts.SyntaxKind.Identifier) {
            const id = <ts.Identifier>typeRef.typeName;
            return id.text === 'LambdaExpression';
        }
    }
    return false;
}

class ExpressionEnvironment {
    private parameters: {[key: string]:ParameterExpression;}[] = [];

    lookupIdentifier(name: string): Expression {
        return this.lookupParameter(name);
    }

    popParameters(): void {
        this.parameters.pop();
    }

    pushParameters(parameters: ParameterExpression[]): void {
        const scope: {[key: string]:ParameterExpression} = {};
        for (var i = 0; i < parameters.length; ++i) {
            const parameter = parameters[i];
            scope[parameter.name] = parameter;
        }
        
        this.parameters.push(scope);
    }

    private lookupParameter(name: string): ParameterExpression {
        for (var i = this.parameters.length; i >= 0; --i) {
            const scope = this.parameters[i - 1];
            const parameter = scope[name];
            if (parameter !== undefined) {
                return parameter;
            }
        }

        return undefined;
    }
}

export class ExpressionAstVisitor extends AstVisitor<Expression> {
    
    private environment: ExpressionEnvironment = new ExpressionEnvironment();
    private types: string[] = [];

    private source: string;

    constructor(source: string) {
        super();
        this.source = source;
    }

    protected visitArrowFunction(node: ts.ArrowFunction): Expression {
        const parameters = this.visitArrayWith(
            node.parameters, 
            <(p: ts.ParameterDeclaration) => ParameterExpression>(this.visitParameter.bind(this)));
        this.environment.pushParameters(parameters);
        const body = this.visit(node.body);
        const lambda = Expression.lambda<Function>(body, parameters);
        this.environment.popParameters();
        return lambda;
    }

    protected visitBinaryExpression(node: ts.BinaryExpression): Expression {
        const left = this.visit(node.left);
        const right = this.visit(node.right);
        switch (node.operatorToken.kind) {
            case ts.SyntaxKind.LessThanToken:
                return Expression.lessThan(left, right);
            case ts.SyntaxKind.GreaterThanToken:
                return Expression.greaterThan(left, right);
            case ts.SyntaxKind.LessThanEqualsToken:
                return Expression.lessThanOrEqual(left, right);
            case ts.SyntaxKind.GreaterThanEqualsToken:
                return Expression.greaterThanOrEqual(left, right);
            case ts.SyntaxKind.EqualsEqualsToken:
            case ts.SyntaxKind.EqualsEqualsEqualsToken:
                return Expression.equal(left, right);
            case ts.SyntaxKind.ExclamationEqualsToken:
            case ts.SyntaxKind.ExclamationEqualsEqualsToken:
                return Expression.notEqual(left, right);
            case ts.SyntaxKind.PlusToken:
                return Expression.add(left, right);
            case ts.SyntaxKind.MinusToken:
                return Expression.subtract(left, right);
            case ts.SyntaxKind.AsteriskToken:
                return Expression.multiply(left, right);
            case ts.SyntaxKind.SlashToken:
                return Expression.divide(left, right);
            case ts.SyntaxKind.PercentToken:
                return Expression.modulo(left, right);
            case ts.SyntaxKind.LessThanLessThanToken:
                return Expression.leftShift(left, right);
            case ts.SyntaxKind.GreaterThanGreaterThanToken:
                return Expression.rightShift(left, right);
            case ts.SyntaxKind.AmpersandToken:
                return Expression.and(left, right);
            case ts.SyntaxKind.BarToken:
                return Expression.or(left, right);
            case ts.SyntaxKind.CaretToken:
                return Expression.exclusiveOr(left, right);
            case ts.SyntaxKind.AmpersandAmpersandToken:
                return Expression.andAlso(left, right);
            case ts.SyntaxKind.BarBarToken:
                return Expression.orElse(left, right);
            case ts.SyntaxKind.EqualsToken:
                return Expression.assign(left, right);
            case ts.SyntaxKind.PlusEqualsToken:
                return Expression.addAssign(left, right);
            case ts.SyntaxKind.MinusEqualsToken:
                return Expression.subtractAssign(left, right);
            case ts.SyntaxKind.AsteriskEqualsToken:
                return Expression.multiplyAssign(left, right);
            // case ts.SyntaxKind.AsteriskAsteriskEqualsToken:
            //     return this.visitAsteriskAsteriskEqualsToken(node);
            case ts.SyntaxKind.SlashEqualsToken:
                return Expression.divideAssign(left, right);
            case ts.SyntaxKind.PercentEqualsToken:
                return Expression.moduloAssign(left, right);
            case ts.SyntaxKind.LessThanLessThanEqualsToken:
                return Expression.leftShiftAssign(left, right);
            case ts.SyntaxKind.GreaterThanGreaterThanEqualsToken:
                return Expression.rightShiftAssign(left, right);
            // case ts.SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken:
            //     return this.visitGreaterThanGreaterThanGreaterThanEqualsToken(node);
            case ts.SyntaxKind.AmpersandEqualsToken:
                return Expression.andAssign(left, right);
            case ts.SyntaxKind.BarEqualsToken:
                return Expression.orAssign(left, right);
            case ts.SyntaxKind.CaretEqualsToken:
                return Expression.exclusiveOrAssign(left, right);
            default:
                throw new Error("Invalid binary token.");
        }
    }

    protected visitCallExpression(node: ts.CallExpression): Expression {
        const expression = this.visit(node.expression);
        const args = this.visitArrayWith(node.arguments, this.visit.bind(this));
        return Expression.invoke(expression, args);
    }

    protected visitConditionalExpression(node: ts.ConditionalExpression): Expression {
        const condition = this.visit(node.condition);
        const whenTrue = this.visit(node.whenTrue);
        const whenFalse = this.visit(node.whenFalse);
        return Expression.condition(condition, whenTrue, whenFalse);
    }

    protected visitElementAccessExpression(node: ts.ElementAccessExpression): Expression {
        const expression = this.visit(node.expression);
        const argumentExpression = this.visit(node.argumentExpression);
        return Expression.arrayIndex(expression, argumentExpression);
    }

    protected visitExpressionStatement(node: ts.ExpressionStatement): Expression {
        return this.visit(node.expression);
    }

    protected visitIdentifier(node: ts.Identifier): Expression {
        return this.environment.lookupIdentifier(node.text);
    }

    protected visitNumericLiteral(node: ts.LiteralExpression): Expression {
        return Expression.constant(JSON.parse(node.text));
    }

    protected visitParameter(node: ts.ParameterDeclaration): ParameterExpression {
        return Expression.parameter((<ts.Identifier>node.name).text);
    }

    protected visitPostfixUnaryExpression(node: ts.PostfixUnaryExpression): Expression {
        const operand = this.visit(node.operand);
        switch (node.operator) {
            case ts.SyntaxKind.PlusPlusToken:
                return Expression.postIncrementAssign(operand);
            case ts.SyntaxKind.MinusMinusToken:
                return Expression.postDecrementAssign(operand);
            default:
                throw new Error("Invalid postfix unary token.")
        }
    }

    protected visitPrefixUnaryExpression(node: ts.PrefixUnaryExpression): Expression {
        const operand = this.visit(node.operand);
        switch (node.operator) {
            // Punctuation
            case ts.SyntaxKind.PlusToken:
                return Expression.unaryPlus(operand);
            case ts.SyntaxKind.MinusToken:
                return Expression.negate(operand);
            case ts.SyntaxKind.PlusPlusToken:
                return Expression.preIncrementAssign(operand);
            case ts.SyntaxKind.MinusMinusToken:
                return Expression.preDecrementAssign(operand);
            case ts.SyntaxKind.ExclamationToken:
                return Expression.not(operand);
            case ts.SyntaxKind.TildeToken:
                return Expression.onesComplement(operand);
            default:
                throw new Error("Invalid prefix unary token.");
        }
    }

    protected visitPropertyAccessExpression(node: ts.PropertyAccessExpression): Expression {
        const expression = this.visit(node.expression);
        return Expression.member(expression, node.name.text);
    }

    protected visitParenthesizedExpression(node: ts.ParenthesizedExpression): Expression {
        return this.visit(node.expression);
    }

    protected visitTypeAssertionExpression(node: ts.TypeAssertion): Expression {
        if (isQuote(node)) {
            const lambda = <LambdaExpression<Function>>this.visit(node.expression);
            const typeRef = <ts.TypeReferenceNode>node.type;
            const typeStr = this.source.substring(typeRef.typeArguments.pos, typeRef.typeArguments.end);
            return CompilerExpression.lambdaDeclaration(typeStr, lambda.body, lambda.parameters)
        }

        // TODO: add convert expression?
        return this.visit(node.expression);
    }
}