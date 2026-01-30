# Security Best Practices

## Critical Rules

1. **Validate client context**: Always validate data from client in server middleware
2. **Use input validators**: Apply schemas to server function inputs
3. **Authenticate early**: Put auth middleware first in chain
4. **Sanitize outputs**: Never expose sensitive server data to client
5. **Rate limiting**: Apply rate limits to public endpoints
6. **CORS configuration**: Set in request middleware for API routes

## Client Context Validation

**Bad - Trusting client data**:

```tsx
const middleware = createMiddleware()
  .client(async ({ next }) => {
    return next({
      sendContext: { userId: getCurrentUserId() },
    })
  })
  .server(async ({ next, context }) => {
    // DANGEROUS: Using client userId without validation
    return await fetchUserData(context.userId)
  })
```

**Good - Validating client data**:

```tsx
const middleware = createMiddleware()
  .client(async ({ next }) => {
    return next({
      sendContext: { token: getAuthToken() },
    })
  })
  .server(async ({ next, context }) => {
    // Validate token on server
    const userId = await validateToken(context.token)
    if (!userId) throw new Error('Invalid token')

    return next({ context: { userId } })
  })
```

## Input Validation

**Always use validators for server functions**:

```tsx
import { z } from 'zod'

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['user', 'admin']),
})

const createUser = createServerFn('POST')
  .inputValidator(userSchema)
  .handler(async ({ data }) => {
    // data is validated and type-safe
    return await db.users.create(data)
  })
```

## Authentication Middleware

```tsx
const authMiddleware = createMiddleware().server(async ({ next }) => {
  const session = await getSession()

  if (!session) {
    throw redirect({ to: '/login' })
  }

  const user = await db.users.find(session.userId)
  if (!user) {
    throw new Error('User not found')
  }

  return next({ context: { user, session } })
})

// Apply to server functions
const protectedFn = createServerFn('GET')
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    return { user: context.user }
  })
```

## Authorization

```tsx
const requireRole = (allowedRoles: string[]) => {
  return createMiddleware()
    .middleware([authMiddleware])
    .server(async ({ next, context }) => {
      if (!allowedRoles.includes(context.user.role)) {
        throw new Error('Forbidden')
      }
      return next()
    })
}

const adminOnlyFn = createServerFn('POST')
  .middleware([requireRole(['admin'])])
  .handler(async () => {
    return await performAdminAction()
  })
```

## Rate Limiting

```tsx
const rateLimitMw = createMiddleware().server(async ({ next }) => {
  const ip = getClientIp()
  const attempts = await getAttempts(ip)

  if (attempts > 100) {
    throw new Error('Rate limit exceeded')
  }

  await incrementAttempts(ip)
  return next()
})

const publicApi = createServerFn('POST')
  .middleware([rateLimitMw])
  .handler(async ({ data }) => {
    return await processRequest(data)
  })
```

## CORS Configuration

```tsx
const corsMiddleware = createMiddleware().server(async ({ next }) => {
  const origin = getRequestOrigin()

  const allowedOrigins = ['https://example.com']
  if (!allowedOrigins.includes(origin)) {
    throw new Error('CORS not allowed')
  }

  return next()
})

// Apply globally in src/start.ts
export const startInstance = createStart(() => {
  return {
    requestMiddleware: [corsMiddleware],
  }
})
```

## Sanitizing Output

```tsx
const getUserData = createServerFn('GET')
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const user = await db.users.find(context.user.id)

    // Remove sensitive fields
    const { password, apiKey, ...safeUser } = user

    return safeUser
  })
```

## SQL Injection Prevention

Use parameterized queries:

```tsx
// Bad - SQL injection risk
const badQuery = createServerFn('GET').handler(async ({ params }) => {
  const query = `SELECT * FROM users WHERE id = ${params.id}`
  return await db.raw(query)
})

// Good - Parameterized
const goodQuery = createServerFn('GET').handler(async ({ params }) => {
  return await db.users.find(params.id)
})
```

## XSS Prevention

Sanitize user input before rendering:

```tsx
import DOMPurify from 'dompurify'

const saveContent = createServerFn('POST').handler(async ({ data }) => {
  const sanitized = DOMPurify.sanitize(data.html)
  return await db.content.create({ html: sanitized })
})
```

## Environment Variables

Never expose secrets to client:

```tsx
// Bad - Exposes secret
const badFn = createServerFn('GET').handler(async () => {
  return { apiKey: process.env.SECRET_API_KEY }
})

// Good - Keep on server
const goodFn = createServerFn('GET').handler(async () => {
  const data = await fetchFromApi(process.env.SECRET_API_KEY)
  return { data }
})
```

## Session Security

```tsx
const sessionMiddleware = createMiddleware().server(async ({ next }) => {
  const session = await getSession()

  // Regenerate session ID on auth
  if (session.isNew) {
    await regenerateSessionId()
  }

  // Set secure cookie flags
  setSecureCookie({
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  })

  return next({ context: { session } })
})
```
