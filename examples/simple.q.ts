import {
    Expression,
    LambdaExpression,
} from '../src/expressions/Expression';

function foo<TFunction extends Function>(f: LambdaExpression<TFunction>) {
    console.log(f.compile()());
}

foo(<LambdaExpression<() => number>>(() => 42));