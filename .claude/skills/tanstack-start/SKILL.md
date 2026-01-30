---
name: tanstack-start
description: Build TanStack Start applications with proper routing, server functions, middleware, and SSR patterns. Use when implementing TanStack Start features, creating routes, server functions, middleware, loaders, or debugging TanStack-specific issues.
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - Bash(bun:*)
user-invocable: true
---

# TanStack Start

## When to Use This Skill

Use when working with TanStack Start projects for:

- Creating file-based routes with loaders and server functions
- Implementing middleware (request or server function)
- Building server-side rendering (SSR) patterns
- Configuring routing and navigation
- Debugging TanStack Start-specific issues

## Quick Reference

**Server Functions**: Use `createServerFn` for server-side data fetching/mutations
**Middleware**: Apply via `.use()` method on server functions
**File Routes**: Auto-generated route tree from `src/routes/`
**Loaders**: Fetch data before render using `createServerFn` + route config

## Core Patterns

### Server Function with Middleware

```tsx
import { createServerFn } from '@tanstack/react-start'

const getUser = createServerFn('GET')
  .middleware([authMiddleware])
  .handler(async () => {
    return { id: 1, name: 'User' }
  })
```

### Route with Loader

```tsx
// src/routes/users/$id.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/users/$id')({
  loader: async ({ params }) => fetchUser(params.id),
  component: UserPage,
})
```

### Middleware Chain

```tsx
const middleware = createMiddleware().server(async ({ next, data }) => {
  // Validate, then pass context
  return next({ context: { userId: data.userId } })
})
```

## Common Workflows

**Adding authenticated endpoint**:

1. Create server function with `createServerFn`
2. Apply auth middleware via `.middleware([authMw])`
3. Implement handler with type-safe context
4. Call from client component

**Creating new route**:

1. Add file in `src/routes/` (e.g., `about.tsx`)
2. Route tree auto-regenerates to `src/routeTree.gen.ts` (do not manually update this file)
3. Define loader if data needed before render
4. Export component for route content

**Global middleware setup**:

1. Define in `src/start.ts` via `createStart`
2. Add to `requestMiddleware` (all requests) or `functionMiddleware` (server functions only)
3. Re-declare in function-specific arrays for type inference

## Domain Reference

**Middleware**: See [middleware.md](references/middleware.md)

- Request vs server function middleware
- Context passing and validation
- Global setup and type inference
- Error handling patterns

**Server Functions**: See [server-functions.md](references/server-functions.md)

- Basic patterns and mutations
- Input validation with Zod
- Protected endpoints
- Type safety

**Routing**: See [routing.md](references/routing.md)

- File-based routing structure
- Dynamic routes and parameters
- Layout routes with Outlet
- Navigation and protected routes

**Data Loading**: See [data-loading.md](references/data-loading.md)

- Loaders and parallel fetching
- Server functions as loaders
- Optimistic updates
- Error handling

**Security**: See [security.md](references/security.md)

- Client context validation
- Authentication and authorization
- Rate limiting and CORS
- Input sanitization

**Debugging**: See [debugging.md](references/debugging.md)

- Route tree issues
- Middleware troubleshooting
- Hydration errors
- Performance optimization

## Key Rules

- Request middleware cannot depend on server function middleware
- Server function middleware can depend on request middleware
- Client-to-server context requires `sendContext` property
- Validate dynamic client context on server before use
- Server code auto-removed from client bundles
- Call `next()` to progress through middleware chain
