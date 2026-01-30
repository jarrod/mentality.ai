# File-Based Routing

## Route Structure

```
src/routes/
├── index.tsx           # /
├── about.tsx           # /about
├── users/
│   ├── index.tsx       # /users
│   └── $id.tsx         # /users/:id
└── admin.tsx           # /admin (layout route with Outlet)
```

## Route Definition

```tsx
// src/routes/users/$id.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/users/$id')({
  loader: async ({ params }) => {
    return await fetchUser(params.id)
  },
  component: UserPage,
})

function UserPage() {
  const data = Route.useLoaderData()
  return <div>{data.name}</div>
}
```

## Layout Routes

```tsx
// src/routes/admin.tsx
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
})

function AdminLayout() {
  return (
    <div>
      <nav>Admin Nav</nav>
      <Outlet /> {/* Nested route content */}
    </div>
  )
}
```

## Route Parameters

**Dynamic segments**: Use `$` prefix

```tsx
// src/routes/posts/$postId.tsx
export const Route = createFileRoute('/posts/$postId')({
  loader: async ({ params }) => {
    return await fetchPost(params.postId)
  },
})
```

**Multiple parameters**:

```tsx
// src/routes/users/$userId/posts/$postId.tsx
export const Route = createFileRoute('/users/$userId/posts/$postId')({
  loader: async ({ params }) => {
    const { userId, postId } = params
    return await fetchUserPost(userId, postId)
  },
})
```

## Route Tree

Auto-generated at `src/routeTree.gen.ts`. Do not edit manually.

**Regeneration**: Happens automatically on dev server start or file changes.

**Troubleshooting**: Delete `src/routeTree.gen.ts` and restart dev server if routes not updating.

## Navigation

```tsx
import { Link, useNavigate } from '@tanstack/react-router'

function Component() {
  const navigate = useNavigate()

  return (
    <>
      <Link to="/about">About</Link>
      <Link to="/users/$id" params={{ id: '123' }}>
        User 123
      </Link>

      <button onClick={() => navigate({ to: '/dashboard' })}>
        Go to Dashboard
      </button>
    </>
  )
}
```

## Search Params

```tsx
export const Route = createFileRoute('/search')({
  validateSearch: (search) => ({
    query: search.query as string,
    page: Number(search.page ?? 1),
  }),
  component: SearchPage,
})

function SearchPage() {
  const { query, page } = Route.useSearch()
  return (
    <div>
      Query: {query}, Page: {page}
    </div>
  )
}
```

## Route Context

Pass data through route hierarchy:

```tsx
// Parent route
export const Route = createFileRoute('/admin')({
  beforeLoad: async () => {
    const user = await getCurrentUser()
    return { user }
  },
  component: AdminLayout,
})

// Child route
export const Route = createFileRoute('/admin/settings')({
  component: Settings,
})

function Settings() {
  const { user } = Route.useRouteContext()
  return <div>User: {user.name}</div>
}
```

## Protected Routes

```tsx
export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) {
      throw redirect({ to: '/login' })
    }
  },
  component: Dashboard,
})
```

## Not Found Routes

```tsx
// src/routes/$.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$')({
  component: NotFound,
})

function NotFound() {
  return <div>404 - Page Not Found</div>
}
```
