## TanStack Start Data Loading Pattern

When integrating Convex with TanStack Start, use a consistent data loading pattern that leverages route loaders for SSR and Suspense for client-side rendering.

---

## Pattern 1: Server-Side Prefetching with Suspense (Recommended for Initial Page Render)

For routes that need to load Convex data on initial render:

1. **Route Loader**: Prefetch data using `ensureQueryData` in the route's `loader` function
2. **Component**: Use `useSuspenseQuery` to access the prefetched data (no loading states needed)

This pattern populates React Query's cache during SSR, then components read from that cache using Suspense.

### Pattern Structure

```typescript
import { convexQuery } from '@convex-dev/react-query';
import { api } from '@convex/_generated/api';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/path')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(
      convexQuery(api.function.name, { /* args */ }),
    );
  },
  component: Component,
});

function Component() {
  const { data } = useSuspenseQuery(
    convexQuery(api.function.name, { /* args */ })
  );
  // Data is guaranteed to be available, no loading checks needed
  return <div>{/* render data */}</div>;
}
```

### Benefits

- **SSR-friendly**: Data is prefetched during server-side rendering, improving initial page load
- **React Query integration**: Data stays in React Query's cache for automatic refetching, invalidation, and real-time updates
- **No loading states**: Suspense boundaries handle loading automatically, simplifying component code
- **Type-safe**: Full TypeScript support with Convex-generated types
- **Consistent**: Same pattern across all routes makes the codebase easier to understand and maintain
- **Live updates**: Convex subscriptions push updates automatically (no polling)

### Cache Key Mechanism

Both loader and component use `convexQuery()` to generate identical cache keys:

```
queryKey: ["convexQuery", api.function.name, { /* args */ }]
```

This ensures:

1. **Loader** prefills cache with this key
2. **Component** queries for the same key and gets a cache hit
3. Data is available immediately, no fetch needed

### When to Use This Pattern

Use the loader + `useSuspenseQuery` pattern when:

- Data is required for the initial page render
- The query is always executed (not conditional)
- You want SSR benefits and faster initial page loads
- You want data to stay in React Query's cache for refetching and invalidation

---

## Pattern 2: Client-Side Queries with TanStack Query (For Conditional/Dialog Data)

For data that loads conditionally (e.g., in dialogs, modals, or based on user interaction), use `useQuery` with `convexQuery` directly. **No route loader is needed.**

### Pattern Structure

```typescript
import { useQuery } from '@tanstack/react-query';
import { convexQuery } from '@convex-dev/react-query';
import { api } from '@convex/_generated/api';
import { useState } from 'react';

function MyComponent() {
  const [dialogOpen, setDialogOpen] = useState(false);

  // Query only runs when dialogOpen is true
  const { data, isPending, error } = useQuery({
    ...convexQuery(api.function.name, { /* args */ }),
    enabled: dialogOpen,  // Only fetch when dialog opens
  });

  return (
    <>
      <button onClick={() => setDialogOpen(true)}>Open Dialog</button>
      {dialogOpen && (
        <dialog>
          {isPending && <div>Loading...</div>}
          {error && <div>Error: {error.message}</div>}
          {data && <div>{/* render data */}</div>}
        </dialog>
      )}
    </>
  );
}
```

### Key Features

- **Conditional execution**: Use `enabled` option to only fetch when needed
- **Loading/error states**: `isPending` and `error` for user feedback
- **Auto-retry**: TanStack Query handles retries automatically
- **Caching**: Data stays in cache for subsequent opens
- **Subscriptions**: Convex still pushes updates via WebSocket automatically
- **No route loader**: This pattern is completely independent of TanStack Start loaders

### Common Scenarios

**Dialog that opens conditionally:**

```typescript
const [editingItem, setEditingItem] = useState<Item | null>(null)

const { data: details } = useQuery({
  ...convexQuery(api.items.getDetails, { id: editingItem?._id ?? '' }),
  enabled: editingItem !== null, // Only fetch when item selected
})
```

**Tab that loads when clicked:**

```typescript
const [activeTab, setActiveTab] = useState('overview')

const { data: analytics } = useQuery({
  ...convexQuery(api.analytics.get, {
    /* args */
  }),
  enabled: activeTab === 'analytics',
})
```

**Search results that update as user types:**

```typescript
const [searchQuery, setSearchQuery] = useState('')

const { data: results } = useQuery({
  ...convexQuery(api.search.query, { q: searchQuery }),
  enabled: searchQuery.length > 2, // Only search if query is long enough
})
```

### When to Use This Pattern

Use `useQuery` with `convexQuery` when:

- Data is only needed in dialogs or modals that open conditionally
- The query is conditional based on user interaction or route params
- Data isn't needed on initial page render
- You need loading states for user feedback
- You're in a nested component, not a route
- You want to avoid SSR complexity for optional data

---

## Pattern 3: Mutations (Writing Data)

For creating, updating, or deleting data, use `useMutation` with `useConvexMutation`:

### Pattern Structure

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useConvexMutation } from '@convex-dev/react-query';
import { api } from '@convex/_generated/api';
import { toast } from 'sonner';

function MyComponent() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.functions.doSomething),
    onSuccess: () => {
      // Invalidate related queries to refresh data
      queryClient.invalidateQueries({
        queryKey: ['convex', api.items.list],
      });
      toast.success('Success!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed');
    },
  });

  const handleSubmit = (data: any) => {
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
```

### Key Features

- **Type-safe**: `useConvexMutation` wraps Convex mutations for full type safety
- **Automatic loading**: `isPending` tracks mutation state
- **Error handling**: `onError` callback for user feedback
- **Cache invalidation**: `onSuccess` callback to refresh related queries
- **Built-in retry**: TanStack Query handles retries automatically
- **No manual state**: No need for `useState(isLoading)` or try/catch blocks

### How `useConvexMutation` Works

```typescript
// useConvexMutation is a React hook wrapper around Convex mutation calls
const convexMutation = useConvexMutation(api.functions.doSomething)

// It returns a function with the same signature as the Convex mutation
// So you can use it directly in useMutation's mutationFn:
const { mutate } = useMutation({
  mutationFn: useConvexMutation(api.functions.doSomething),
  // Now mutate(args) calls the Convex function with type safety
})
```

### Query Invalidation Patterns

```typescript
// Invalidate a single query
queryClient.invalidateQueries({
  queryKey: ['convex', api.items.list],
})

// Invalidate multiple related queries
queryClient.invalidateQueries({
  queryKey: ['convex', api.items.get],
})
queryClient.invalidateQueries({
  queryKey: ['convex', api.items.list],
})

// Invalidate all Convex queries (nuclear option)
queryClient.invalidateQueries({
  predicate: (query) => query.queryKey[0] === 'convex',
})
```

### Common Mutation Examples

**Create with success notification:**

```typescript
const { mutate: createItem } = useMutation({
  mutationFn: useConvexMutation(api.items.create),
  onSuccess: (newItem) => {
    queryClient.invalidateQueries({ queryKey: ['convex', api.items.list] })
    toast.success(`Created: ${newItem.name}`)
    onClose?.() // Close dialog
  },
  onError: (error) => {
    toast.error(error.message)
  },
})
```

**Update with optimistic UI:**

```typescript
const { mutate: updateItem } = useMutation({
  mutationFn: (data) =>
    useConvexMutation(api.items.update)({ id: item._id, ...data }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['convex', api.items.get] })
    queryClient.invalidateQueries({ queryKey: ['convex', api.items.list] })
  },
})
```

**Delete with confirmation:**

```typescript
const { mutate: deleteItem, isPending } = useMutation({
  mutationFn: useConvexMutation(api.items.delete),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['convex', api.items.list] })
    toast.success('Deleted successfully')
    navigate('/items') // Navigate after success
  },
  onError: (error) => {
    toast.error(error.message || 'Failed to delete')
  },
})
```

### When to Use Mutations

Use `useMutation` with `useConvexMutation` when:

- Creating, updating, or deleting data
- You need to show loading state to user
- You need to handle errors with user feedback
- You need to refresh related queries after success
- You want automatic retry logic
- You're in any component (routes or nested components)

---

## Comparison Chart

| Scenario                         | Pattern   | Loader? | Hook               | SSR | Loading State |
| -------------------------------- | --------- | ------- | ------------------ | --- | ------------- |
| List page (always shown)         | Pattern 1 | Yes     | `useSuspenseQuery` | Yes | Suspense      |
| Detail page (always shown)       | Pattern 1 | Yes     | `useSuspenseQuery` | Yes | Suspense      |
| Dialog (opens conditionally)     | Pattern 2 | No      | `useQuery`         | No  | Manual        |
| Search/filter (user interaction) | Pattern 2 | No      | `useQuery`         | No  | Manual        |
| Form submission                  | Pattern 3 | No      | `useMutation`      | No  | `isPending`   |
| Delete confirmation              | Pattern 3 | No      | `useMutation`      | No  | `isPending`   |

---

## Real-World Examples

### Example 1: Application List (Pattern 1)

```typescript
// src/routes/_authenticated/applications/index.tsx
export const Route = createFileRoute('/_authenticated/applications/')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(
      convexQuery(api.applications.list, {}),
    );
  },
  component: ApplicationsPage,
});

function ApplicationsPage() {
  return <ApplicationList />;
}

// src/components/applications/application-list.tsx
export function ApplicationList() {
  const { data: applications } = useSuspenseQuery(
    convexQuery(api.applications.list, {})
  );
  // Data is guaranteed to be available
  return <div>{/* render list */}</div>;
}
```

### Example 2: Create Dialog (Pattern 3)

```typescript
// src/components/applications/create-application-dialog.tsx
export function CreateApplicationDialog({ open, onOpenChange }) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.applications.create),
    onSuccess: () => {
      toast.success('Application created');
      queryClient.invalidateQueries({
        queryKey: ['convex', api.applications.list],
      });
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form onSubmit={(e) => {
        e.preventDefault();
        mutate(formData);
      }}>
        <button type="submit" disabled={isPending}>
          {isPending ? 'Creating...' : 'Create'}
        </button>
      </form>
    </Dialog>
  );
}
```

### Example 3: Conditional Details (Pattern 2)

```typescript
// src/components/items/item-details.tsx
export function ItemDetails({ itemId }: { itemId: string | null }) {
  const { data: details, isPending, error } = useQuery({
    ...convexQuery(api.items.getDetails, { id: itemId ?? '' }),
    enabled: itemId !== null,  // Only fetch when itemId is set
  });

  if (itemId === null) return null;
  if (isPending) return <div>Loading details...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{/* render details */}</div>;
}
```

---

## TypeScript Notes

You may encounter type inference issues with `ensureQueryData` and need to use `@ts-expect-error` comments. This is a known limitation with Convex query type inference in loaders and doesn't affect runtime behavior:

```typescript
// @ts-expect-error - TypeScript hits recursion limit with convexQuery's complex conditional types
await context.queryClient.ensureQueryData(
  convexQuery(api.applications.list, {}),
)
```
