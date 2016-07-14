import {
    Expression,
    ExpressionType,
    ExpressionVisitor,
    ExpressionVisitorGeneric,
    ParameterExpression,
} from '../expressions/Expression';

export class CompilerExpression extends Expression {
    
    _extensionType: CompilerExpressionType;

    constructor(extensionType: CompilerExpressionType) {
        super(ExpressionType.Extension);
        this._extensionType = extensionType;
    }

    get extensionType(): CompilerExpressionType {
        return this._extensionType;
    }

    accept(visitor: ExpressionVisitor): Expression {
        return visitor.visitExtension(this);
    }

    acceptGeneric<T>(visitor: ExpressionVisitorGeneric<T>): T {
        return visitor.visitExtension(this);
    }

    static lambdaDeclaration( type: string, body: Expression, parameters: ParameterExpression[]): LambdaDeclarationExpression {
        return new LambdaDeclarationExpression(type, body, parameters);
    }
}

export class LambdaDeclarationExpression extends CompilerExpression {
    _type: string;
    _body: Expression;
    _parameters: ParameterExpression[];

    constructor(type: string, body: Expression, parameters: ParameterExpression[]) {
        super(CompilerExpressionType.LambdaDeclaration);
        this._type = type;
        this._body = body;
        this._parameters = parameters;
    }

    get type(): string {
        return this._type;
    }

    get body(): Expression {
        return this._body;
    }

    get parameters(): ParameterExpression[] {
        return this._parameters;
    }

    update(type: string, body: Expression, parameters: ParameterExpression[]): LambdaDeclarationExpression {
        if (type !== this._type || body !== this._body || parameters !== this._parameters) {
            return new LambdaDeclarationExpression(type, body, parameters);
        }

        return this;
    }
}

export enum CompilerExpressionType {
    LambdaDeclaration,
} 
