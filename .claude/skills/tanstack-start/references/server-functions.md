# Server Functions

## Basic Pattern

```tsx
import { createServerFn } from '@tanstack/react-start'

export const getData = createServerFn('GET').handler(async () => {
  return { data: 'value' }
})

// Call from client
const result = await getData()
```

## With Parameters

```tsx
export const getUser = createServerFn('GET').handler(async ({ params }) => {
  const { id } = params
  return await db.users.find(id)
})

// Call with params
const user = await getUser({ params: { id: '123' } })
```

## Mutations (POST)

```tsx
export const updateUser = createServerFn('POST').handler(async ({ data }) => {
  return await db.users.update(data)
})

// Call from client
await updateUser({ data: { name: 'New Name' } })
```

## With Middleware

```tsx
const authFn = createServerFn('GET')
  .middleware([authMiddleware, rateLimitMiddleware])
  .handler(async ({ context }) => {
    // context from middleware chain
    return { user: context.user }
  })
```

## Input Validation

```tsx
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

const createAccount = createServerFn('POST')
  .inputValidator(schema)
  .handler(async ({ data }) => {
    // data is validated and type-safe
    return await db.accounts.create(data)
  })
```

## Common Patterns

### Protected Endpoint

```tsx
const authMw = createMiddleware().server(async ({ next }) => {
  const session = await getSession()
  if (!session) throw redirect({ to: '/login' })
  return next({ context: { user: session.user } })
})

const protectedData = createServerFn('GET')
  .middleware([authMw])
  .handler(async ({ context }) => {
    return await fetchUserData(context.user.id)
  })
```

### Form Mutation with Validation

```tsx
import { z } from 'zod'

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

const submitForm = createServerFn('POST')
  .inputValidator(formSchema)
  .middleware([rateLimitMw])
  .handler(async ({ data }) => {
    return await processForm(data)
  })
```

### Error Handling

```tsx
const safeFn = createServerFn('POST').handler(async ({ data }) => {
  try {
    return await riskyOperation(data)
  } catch (error) {
    console.error('Operation failed:', error)
    throw new Error('Failed to process request')
  }
})
```

## Type Safety

Server functions provide end-to-end type safety from client to server:

```tsx
const getTypedData = createServerFn('GET').handler(async () => {
  return { id: 1, name: 'User', role: 'admin' as const }
})

// Client usage - fully typed
const data = await getTypedData()
// data: { id: number; name: string; role: 'admin' }
```

## Bundle Optimization

Server handler code never ships to client. Only the function signature and call mechanism are included in client bundle.
