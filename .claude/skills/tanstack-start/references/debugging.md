# Debugging

## Route Tree Issues

**Symptom**: Routes not updating, 404 errors on valid routes

**Solution**: Delete generated route tree and restart

```bash
rm src/routeTree.gen.ts
# Restart dev server
```

## Middleware Not Applying

**Symptom**: Context not available, middleware code not running

**Check**:

1. Middleware in array: `.middleware([authMw])`
2. Handler uses context: `async ({ context })`
3. Global middleware re-declared for type inference

```tsx
// Re-declare global middleware for types
const fn = createServerFn('GET')
  .middleware([globalAuthMw]) // Re-declare
  .handler(async ({ context }) => {
    // Now context.user is typed
  })
```

## Type Errors

**Symptom**: TypeScript errors on context access

**Solution**: Re-declare global middleware in function-specific arrays

```tsx
// Global middleware defined in src/start.ts
const authMw = createMiddleware()
  .server(async ({ next }) => {
    return next({ context: { user: {...} } })
  })

// Re-declare in function for types
const fn = createServerFn('GET')
  .middleware([authMw])
  .handler(async ({ context }) => {
    context.user // Now typed correctly
  })
```

## Context Not Available

**Client-to-server**: Requires `sendContext`

```tsx
const mw = createMiddleware().client(async ({ next }) => {
  return next({
    sendContext: { token: getToken() }, // Must use sendContext
  })
})
```

**Server-to-server**: Use `next({ context })`

```tsx
const mw = createMiddleware().server(async ({ next }) => {
  return next({
    context: { userId: 123 }, // Pass to next middleware
  })
})
```

## Loader Not Running

**Check**:

1. Loader function exported in route file
2. No errors in loader (check console)
3. Route properly defined with `createFileRoute`

```tsx
// Correct loader setup
export const Route = createFileRoute('/page')({
  loader: async () => {
    console.log('Loader running') // Debug output
    return await fetchData()
  },
  component: Page,
})
```

## Server Function Not Found

**Symptom**: Function call fails with "not found"

**Check**:

1. Function exported from file
2. Correct import path in client
3. Function properly defined with `createServerFn`

```tsx
// src/functions/users.ts
export const getUser = createServerFn('GET').handler(async () => ({
  name: 'User',
}))

// Client usage
import { getUser } from '@/functions/users'
const data = await getUser()
```

## Hydration Errors

**Symptom**: React hydration mismatch warnings

**Causes**:

- Server and client render different content
- Using browser-only APIs in SSR
- Random data generated during render

**Solution**: Use `useEffect` for client-only code

```tsx
function Component() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div>Loading...</div>
  }

  return <div>{new Date().toString()}</div>
}
```

## Middleware Chain Order

**Issue**: Middleware runs in unexpected order

**Rule**: Middleware runs in array order

```tsx
const fn = createServerFn('GET')
  .middleware([
    loggerMw, // Runs first
    authMw, // Runs second
    validateMw, // Runs third
  ])
  .handler(async () => {
    // Runs last
  })
```

## CORS Errors

**Symptom**: Blocked by CORS policy

**Solution**: Configure CORS in request middleware

```tsx
const corsMw = createMiddleware().server(async ({ next }) => {
  // Set CORS headers
  setHeader('Access-Control-Allow-Origin', 'https://example.com')
  setHeader('Access-Control-Allow-Methods', 'GET, POST')
  return next()
})

// Apply globally
export const startInstance = createStart(() => {
  return {
    requestMiddleware: [corsMw],
  }
})
```

## Performance Issues

**Check**:

1. Parallel data fetching in loaders
2. Unnecessary re-renders
3. Large bundle size

**Solutions**:

Parallel fetching:

```tsx
loader: async () => {
  // Good - parallel
  const [a, b] = await Promise.all([fetchA(), fetchB()])

  // Bad - sequential
  const a = await fetchA()
  const b = await fetchB()
}
```

Code splitting:

```tsx
const HeavyComponent = lazy(() => import('./HeavyComponent'))

function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  )
}
```

## Environment Variable Issues

**Symptom**: `process.env.VAR` is undefined

**Check**:

1. Variable in `.env` file
2. Server-side code only (client doesn't have access)
3. Restart dev server after `.env` changes

```tsx
// Only works in server functions
const fn = createServerFn('GET').handler(async () => {
  const apiKey = process.env.API_KEY // Available
  return await fetchData(apiKey)
})
```
