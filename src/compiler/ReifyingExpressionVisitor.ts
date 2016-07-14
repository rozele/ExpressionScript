import {
    Expression,
    ExpressionType,
    ExpressionVisitorGeneric,
    BinaryExpression,
    ConditionalExpression,
    ConstantExpression,
    FunctionCallExpression,
    IndexExpression,
    InvocationExpression,
    LambdaExpression,
    MemberExpression,
    NewExpression,
    ParameterExpression,
    UnaryExpression,
} from '../expressions/Expression';

import {
    CompilerExpression,
    CompilerExpressionType,
    LambdaDeclarationExpression,
} from './CompilerExpressions';

export class ReifyingExpressionVisitor extends ExpressionVisitorGeneric<string> {
    private scopes: ParameterExpression[][] = [];

    visitConstant(node: ConstantExpression): string {
        return "Expression.constant(" + node.value + ")";
    }

    visitParameter(node: ParameterExpression): string {
        this.scopes.forEach((scope, i) => {
            scope.forEach((p, j) => {
                if (node === p) {
                    return `p${i}${j}`;
                }
            });
        });
        
        return "Expression.parameter('" + node.name + "')";
    }

    visitBinary(node: BinaryExpression): string {
        return "Expression." + ExpressionType[node.nodeType] + "(" + this.visit(node.left) + ", " + this.visit(node.right) + ")";
    }

    visitUnary(node: UnaryExpression): string {
        return "Expression." + ExpressionType[node.nodeType] + "(" + this.visit(node.operand) + ")";
    }

    visitConditional(node: ConditionalExpression): string {
        return "Expression.conditional(" + this.visit(node.test) + ", " + this.visit(node.ifTrue) + ", " + this.visit(node.ifFalse) + ")";
    }

    visitLambda<T extends Function>(node: LambdaExpression<T>): string {
        throw new Error("invalid operation");
    }

    visitInvoke(node: InvocationExpression): string {
        var expression = this.visit(node.expression);
        var args = this.visitMany(node.args);
        return `Expression.invoke(${expression}, [${args.join(", ")}])`;
    }

    visitCall(node: FunctionCallExpression): string {
        var children = this.visitMany(node.args);
        if (node.obj != null) {
            children.unshift(this.visit(node.obj));
        }
        children.unshift(node.method);
        return "Expression.call(" + children.join(", ") + ")";
    }

    visitNew(node: NewExpression): string {
        var children = this.visitMany(node.args);
        children.unshift(node.type);
        return "Expression.new(" + children.join(", ") + ")";
    }

    visitMember(node: MemberExpression): string {
        var children = <string[]>[];
        if (node.obj != null) {
            children.unshift(this.visit(node.obj));
        }
        children.unshift(node.member);
        return "Expression.member(" + children.join(", ") + ")";
    }

    visitIndex(node: IndexExpression): string {
        var children = this.visitMany(node.args);
        if (node.obj != null) {
            children.unshift(this.visit(node.obj));
        }
        return "Expression.index(" + children.join(", ") + ")";
    }

    visitExtension(node: Expression): string {
        var ext = <CompilerExpression>node;
        switch (ext.extensionType) {
            case CompilerExpressionType.LambdaDeclaration:
                return this.visitLambdaDeclaration(<LambdaDeclarationExpression>node);
            default:
                throw new Error("not implemented");
        }
    }

    visitLambdaDeclaration(node: LambdaDeclarationExpression): string {
        let parameterDecls: string = "";
        let closingParens: string = "";
        node.parameters.forEach((p, i) => {
            parameterDecls += `Expression.parameter('${p.name}').let(p${this.scopes.length}${i} => `;
            closingParens += ")";
        });

        this.scopes.push(node.parameters);
        var body = this.visit(node.body);
        var parameters = this.visitMany(node.parameters);
        this.scopes.pop();

        return `${parameterDecls}Expression.lambda<${node.type}>(${body}, [${parameters.join(', ')}])${closingParens}`;
    }
}