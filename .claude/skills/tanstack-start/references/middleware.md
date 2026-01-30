# Middleware

## Overview

Middleware customizes server route behavior and server functions through composable, chainable operations.

**Use cases**:

- Authentication/authorization
- Request/response logging
- Error handling
- Performance monitoring
- Data validation
- Security policies

## Types

**Request Middleware**: Processes all incoming requests (routes, SSR, server functions)

- Method: `.server()` only
- Runs on every server request

**Server Function Middleware**: Handles server function execution specifically

- Methods: `.client()`, `.server()`, `.inputValidator()`
- Additional capabilities beyond request middleware

**Dependency rule**: Request middleware cannot depend on server function middleware. Server function middleware can depend on request middleware.

## Middleware Chain

```tsx
import { createMiddleware } from '@tanstack/react-start'

const loggerMw = createMiddleware().server(async ({ next }) => {
  console.log('Before')
  const result = await next()
  console.log('After')
  return result
})

const authMw = createMiddleware().server(async ({ next, context }) => {
  const user = await validateSession()
  if (!user) throw new Error('Unauthorized')
  return next({ context: { user } })
})

// Chain by wrapping
const protectedMw = authMw.pipe(loggerMw)
```

Call `next()` to continue chain. Skip `next()` to terminate early.

## Context Passing

**Upstream context** (server-to-server):

```tsx
const middleware = createMiddleware().server(async ({ next }) => {
  return next({
    context: { userId: 123, role: 'admin' },
  })
})

const handler = createServerFn('GET')
  .middleware([middleware])
  .handler(async ({ context }) => {
    // context.userId and context.role available
  })
```

**Client-to-server context**:

```tsx
const middleware = createMiddleware()
  .client(async ({ next }) => {
    return next({
      sendContext: { token: getToken() },
    })
  })
  .server(async ({ next, context }) => {
    // CRITICAL: Validate client context
    if (!isValidToken(context.token)) {
      throw new Error('Invalid token')
    }
    return next()
  })
```

**Security**: Always validate client context on server. Never trust client data.

**Server-to-client context**:

```tsx
const middleware = createMiddleware().server(async ({ next }) => {
  const result = await next()
  return {
    ...result,
    context: { serverInfo: 'visible to client' },
  }
})

// Client receives via function call
const data = await serverFn()
// Access data.serverInfo
```

## Global Middleware

Configure in `src/start.ts`:

```tsx
import { createStart } from '@tanstack/react-start'

export const startInstance = createStart(() => {
  return {
    requestMiddleware: [corsMiddleware, loggerMiddleware],
    functionMiddleware: [authMiddleware, validationMiddleware],
  }
})
```

**Type inference**: Re-declare global middleware in function-specific arrays for proper typing:

```tsx
const myFn = createServerFn('GET')
  .middleware([authMiddleware]) // Re-declare for types
  .handler(async ({ context }) => {
    // context.user properly typed
  })
```

## Client Request Modification

Modify outgoing requests from client:

```tsx
const middleware = createMiddleware().client(async ({ next }) => {
  return next({
    headers: {
      'X-Custom-Header': 'value',
      Authorization: `Bearer ${token}`,
    },
  })
})
```

Currently supported: `headers` object.

## Input Validation

Validate server function inputs:

```tsx
import { z } from 'zod'

const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
})

const createUser = createServerFn('POST')
  .inputValidator(userSchema)
  .handler(async ({ data }) => {
    // data is type-safe and validated
    return await db.users.create(data)
  })
```

## Bundle Optimization

Server code automatically removed from client bundle:

```tsx
const middleware = createMiddleware().server(async ({ next }) => {
  // This code never ships to browser
  const secretKey = process.env.SECRET_KEY
  const dbConnection = await connectDB()
  return next()
})
```

No manual code splitting needed.

## Error Handling Pattern

```tsx
const errorMw = createMiddleware().server(async ({ next }) => {
  try {
    return await next()
  } catch (error) {
    console.error('Server error:', error)
    throw new Error('Operation failed')
  }
})
```

## Type Safety

### Context Typing

```tsx
type AuthContext = {
  user: { id: string; role: string }
}

const authMw = createMiddleware<{ context: AuthContext }>().server(
  async ({ next }) => {
    const user = await authenticate()
    return next({ context: { user } })
  },
)

const handler = createServerFn('GET')
  .middleware([authMw])
  .handler(async ({ context }) => {
    // context.user fully typed
    return context.user.role
  })
```

### Validator Inference

```tsx
const schema = z.object({ name: z.string() })

const fn = createServerFn('POST')
  .inputValidator(schema)
  .handler(async ({ data }) => {
    // data: { name: string } inferred
  })
```
