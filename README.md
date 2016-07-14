# ExpressionScript
Code-as-data compiler for TypeScript.

## Examples

To test out the examples, compile the project with:

```
tsc --target es5 src\compiler\compile.ts
```

Then run the compiler with:

```
node bin\cli examples\simple.q.ts
```

The input file `simple.q.ts`:
```ts
import {
    Expression,
    LambdaExpression,
} from '../src/expressions/Expression';

function foo<TFunction extends Function>(f: LambdaExpression<TFunction>) {
    console.log(f.compile()());
}

foo(<LambdaExpression<() => number>>(() => 42));
```

Will be converted to the output file `simple.ts`:
```ts
import {
    Expression,
    LambdaExpression,
} from '../src/expressions/Expression';

function foo<TFunction extends Function>(f: LambdaExpression<TFunction>) {
    console.log(f.compile()());
}

foo(Expression.lambda<() => number>(Expression.constant(42), []));
```
