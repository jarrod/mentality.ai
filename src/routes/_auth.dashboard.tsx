import { SignedIn, SignedOut, SignOutButton, UserButton } from '@clerk/tanstack-react-start'
import { auth } from '@clerk/tanstack-react-start/server'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

const authStateFn = createServerFn().handler(async () => {
  const { isAuthenticated, userId } = await auth()

  if (!isAuthenticated) {
    // This will error because you're redirecting to a path that doesn't exist yet
    // You can create a sign-in route to handle this
    // See https://clerk.com/docs/tanstack-react-start/guides/development/custom-sign-in-or-up-page
    throw redirect({
      to: '/',
    })
  }

  return { userId }
})

export const Route = createFileRoute('/_auth/dashboard')({
  beforeLoad: async () => await authStateFn(),
  loader: async ({ context }) => {
    return { userId: context.userId }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const state = Route.useLoaderData()

  return (
    <div>
      <SignedIn>
        <p>You are signed in</p>

        <UserButton />

        <SignOutButton />
      </SignedIn>
      <SignedOut>Signed out</SignedOut>
    </div>
  )
}

