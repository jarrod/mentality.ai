import { AppSidebar, type SidebarUser } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import type { User } from "@clerk/backend";
import { auth, clerkClient } from "@clerk/tanstack-react-start/server";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

const authStateFn = createServerFn().handler(async () => {
    const { isAuthenticated, userId } = await auth()

    if (!isAuthenticated) {
        throw redirect({
            to: '/',
        })
    }

    return { userId, isAuthenticated }
})

/** Extracts sidebar user fields from Clerk User. */
function toSidebarUser(user: User): SidebarUser {
    const email = user.primaryEmailAddress?.emailAddress ?? user.emailAddresses?.[0]?.emailAddress ?? null
    return {
        firstName: user.firstName ?? null,
        profilePictureUrl: user.imageUrl ?? null,
        email: email ?? null,
    }
}

export const Route = createFileRoute('/_auth')({
    component: RouteComponent,
    beforeLoad: async () => await authStateFn(),
    loader: async ({ context }) => {
        const user = await clerkClient().users.getUser(context.userId)
        const sidebarUser = toSidebarUser(user)
        return { userId: context.userId, sidebarUser }
    },
})

function RouteComponent() {
    const { sidebarUser } = Route.useLoaderData()
    return (
        <SidebarProvider>
            <AppSidebar user={sidebarUser} />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                </header>
                <Outlet />
            </SidebarInset>
        </SidebarProvider>
    )
}
