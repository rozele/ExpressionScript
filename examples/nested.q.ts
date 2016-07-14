import {
    Expression,
    LambdaExpression,
} from '../src/expressions/Expression';

function foo<TFunction extends Function>(f: LambdaExpression<TFunction>) {

}

foo(<LambdaExpression<(f: (e: Expression) => number) => number>>(f => f(<LambdaExpression<() => number>(() => 42))));