import { auth } from "@clerk/tanstack-react-start/server"
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"

const authStateFn = createServerFn().handler(async () => {
    const { isAuthenticated, userId } = await auth()
    if (!isAuthenticated) throw redirect({ to: "/" })
    return { userId, isAuthenticated }
})

export const Route = createFileRoute("/_auth")({
    beforeLoad: async () => await authStateFn(),
    component: () => <Outlet />,
})
