import { AppSidebar, type SidebarUser } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { checkRole } from "@/lib/roles"
import type { User } from "@clerk/backend"
import { auth, clerkClient } from "@clerk/tanstack-react-start/server"
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"

const ensureAdminFn = createServerFn().handler(async () => {
  const isAdmin = await checkRole("admin")
  if (!isAdmin) throw redirect({ to: "/assist" })
})

function toSidebarUser(user: User): SidebarUser {
  const email =
    user.primaryEmailAddress?.emailAddress ??
    user.emailAddresses?.[0]?.emailAddress ??
    null
  return {
    firstName: user.firstName ?? null,
    profilePictureUrl: user.imageUrl ?? null,
    email: email ?? null,
  }
}

const getSidebarUserFn = createServerFn().handler(async () => {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthenticated")
  const [user, isAdmin] = await Promise.all([
    clerkClient().users.getUser(userId).then(toSidebarUser),
    checkRole("admin"),
  ])
  return { user, isAdmin }
})

export const Route = createFileRoute("/_auth/admin")({
  beforeLoad: async () => await ensureAdminFn(),
  loader: async () => {
    const { user: sidebarUser, isAdmin } = await getSidebarUserFn()
    return { sidebarUser, isAdmin }
  },
  component: AdminLayoutComponent,
})

function AdminLayoutComponent() {
  const { sidebarUser, isAdmin } = Route.useLoaderData()
  return (
    <SidebarProvider>
      <AppSidebar user={sidebarUser} isAdmin={isAdmin} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
