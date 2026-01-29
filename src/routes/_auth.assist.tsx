import { AssistLayout } from "@/components/assist-layout"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_auth/assist")({
  loader: async ({ context }) => {
    return { userId: context.userId, isAuthenticated: context.isAuthenticated }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <AssistLayout>
      <div className="p-4">Hello "/_auth/assist"!</div>
    </AssistLayout>
  )
}
