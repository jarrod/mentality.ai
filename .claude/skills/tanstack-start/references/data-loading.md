# Data Loading

## Loaders

Execute before route renders:

```tsx
export const Route = createFileRoute('/dashboard')({
  loader: async () => {
    const [users, stats] = await Promise.all([fetchUsers(), fetchStats()])
    return { users, stats }
  },
  component: Dashboard,
})
```

## Server Functions as Loaders

```tsx
const getPageData = createServerFn('GET')
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    return await fetchData(context.user)
  })

export const Route = createFileRoute('/page')({
  loader: () => getPageData(),
  component: Page,
})
```

## Access Loader Data

```tsx
function Page() {
  const data = Route.useLoaderData()
  return <div>{data.value}</div>
}
```

## Parallel Data Fetching

```tsx
export const Route = createFileRoute('/dashboard')({
  loader: async () => {
    // Fetch in parallel
    const [users, posts, stats] = await Promise.all([
      getUsers(),
      getPosts(),
      getStats(),
    ])
    return { users, posts, stats }
  },
})
```

## Conditional Loading

```tsx
export const Route = createFileRoute('/conditional')({
  loader: async ({ context }) => {
    if (!context.user) return null
    return await fetchUserData(context.user.id)
  },
})
```

## Dependent Data Fetching

```tsx
export const Route = createFileRoute('/sequential')({
  loader: async () => {
    const user = await fetchUser()
    const posts = await fetchUserPosts(user.id)
    const comments = await fetchPostComments(posts[0].id)
    return { user, posts, comments }
  },
})
```

## Loading States

```tsx
import { useSuspenseQuery } from '@tanstack/react-query'

function Component() {
  const { data, isLoading, error } = useSuspenseQuery({
    queryKey: ['data'],
    queryFn: fetchData,
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return <div>{data.value}</div>
}
```

## Optimistic Updates

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query'

function Component() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: updateData,
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ['data'] })

      const previous = queryClient.getQueryData(['data'])
      queryClient.setQueryData(['data'], newData)

      return { previous }
    },
    onError: (err, newData, context) => {
      queryClient.setQueryData(['data'], context.previous)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['data'] })
    },
  })

  return (
    <button onClick={() => mutation.mutate({ value: 'new' })}>Update</button>
  )
}
```

## Prefetching

```tsx
export const Route = createFileRoute('/dashboard')({
  loader: async () => {
    const data = await fetchDashboard()

    // Prefetch related data
    queryClient.prefetchQuery({
      queryKey: ['user', data.userId],
      queryFn: () => fetchUser(data.userId),
    })

    return data
  },
})
```

## Error Handling

```tsx
export const Route = createFileRoute('/data')({
  loader: async () => {
    try {
      return await fetchData()
    } catch (error) {
      console.error('Failed to load data:', error)
      throw error
    }
  },
  errorComponent: ({ error }) => {
    return <div>Failed to load: {error.message}</div>
  },
  component: DataPage,
})
```

## Stale-While-Revalidate

```tsx
import { useSuspenseQuery } from '@tanstack/react-query'

function Component() {
  const { data } = useSuspenseQuery({
    queryKey: ['data'],
    queryFn: fetchData,
    staleTime: 5000, // Consider fresh for 5s
    cacheTime: 10000, // Keep in cache for 10s
  })

  return <div>{data.value}</div>
}
```
