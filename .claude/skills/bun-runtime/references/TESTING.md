# Bun Testing Reference

Source: https://bun.com/docs/test/writing-tests.md

## Basics

- Import from `bun:test`:
  - `import { test, describe, expect } from "bun:test";`
- Jest-like API; not all Jest matchers are implemented.
- Default test timeout is 5000ms. You can override per test.

## Test Definition

```ts
import { expect, test } from 'bun:test'

test('2 + 2', () => {
  expect(2 + 2).toBe(4)
})
```

## Grouping

```ts
import { describe, test, expect } from 'bun:test'

describe('arithmetic', () => {
  test('2 * 2', () => {
    expect(2 * 2).toBe(4)
  })
})
```

## Async Tests

```ts
import { test, expect } from 'bun:test'

test('async example', async () => {
  const value = await Promise.resolve(42)
  expect(value).toBe(42)
})
```

Or use a `done` callback (must be called or the test hangs):

```ts
import { test, expect } from 'bun:test'

test('async done', (done) => {
  Promise.resolve(3).then((value) => {
    expect(value).toBe(3)
    done()
  })
})
```

## Timeouts

```ts
import { test, expect } from 'bun:test'

test('slow op', async () => {
  const data = await slowOperation()
  expect(data).toBe(42)
}, 500)
```

- Timeouts throw an uncatchable exception and stop the test.
- Child processes spawned during a timed-out test are killed.

## Retries and Repeats

```ts
import { test, expect } from 'bun:test'

test(
  'flaky',
  async () => {
    const response = await fetch('https://example.com/api')
    expect(response.ok).toBe(true)
  },
  { retry: 3 },
)
```

```ts
import { test, expect } from 'bun:test'

test(
  'stability',
  () => {
    expect(Math.random()).toBeLessThan(1)
  },
  { repeats: 20 },
)
```

- `retry` and `repeats` are mutually exclusive.
- `repeats: N` runs N+1 times (1 initial + N repeats).

## Test Modifiers

- `test.skip`, `test.todo`, `test.only`
- `test.if(condition)` runs only if condition is truthy.
- `test.skipIf(condition)` skips if condition is truthy.
- `test.todoIf(condition)` marks TODO if condition is truthy.
- `test.failing` inverts result: expected to fail.
- `describe.only`, `describe.if`, `describe.skipIf`, `describe.todoIf` apply to suites.

Run only/ todo:

```bash
bun test --only
bun test --todo
```

## Parametrized Tests

```ts
import { test, describe, expect } from 'bun:test'

const cases = [
  [1, 2, 3],
  [3, 4, 7],
]

test.each(cases)('%p + %p = %p', (a, b, expected) => {
  expect(a + b).toBe(expected)
})

describe.each([
  [1, 2, 3],
  [3, 4, 7],
])('add(%i, %i)', (a, b, expected) => {
  test('returns expected', () => {
    expect(a + b).toBe(expected)
  })
})
```

## Assertion Counting

```ts
import { test, expect } from 'bun:test'

test('counts assertions', () => {
  expect.assertions(2)
  expect(1 + 1).toBe(2)
  expect('hello').toContain('ell')
})
```

- `expect.hasAssertions()` ensures at least one assertion runs.

## Type Testing

- `expectTypeOf` is a compile-time helper; it is a no-op at runtime.
- Run `bunx tsc --noEmit` to verify type assertions.

```ts
import { expectTypeOf } from 'bun:test'

expectTypeOf<string>().toEqualTypeOf<string>()
expectTypeOf(123).toBeNumber()
```

## Common Matchers

- Equality: `toBe`, `toEqual`, `toStrictEqual`
- Truthiness: `toBeDefined`, `toBeTruthy`, `toBeFalsy`, `toBeNull`
- Strings/arrays: `toContain`, `toHaveLength`, `toMatch`
- Numbers: `toBeGreaterThan`, `toBeLessThan`, `toBeCloseTo`
- Errors: `toThrow`
- Promises: `resolves`, `rejects`
- Mocks: `toHaveBeenCalled`, `toHaveBeenCalledWith`, `toHaveBeenCalledTimes`
- Snapshots: `toMatchSnapshot`, `toMatchInlineSnapshot`

## Best Practices

- Use descriptive test names.
- Group related tests with `describe`.
- Use specific matchers over boolean checks.
- Test error paths and async failures.
- Use `beforeEach`/`afterEach` for setup/teardown.
