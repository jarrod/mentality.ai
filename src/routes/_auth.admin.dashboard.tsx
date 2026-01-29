import { InferenceItem } from '@/components/inference-item'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/admin/dashboard')({
  loader: async ({ context }) => {
    return { userId: context.userId, isAuthenticated: context.isAuthenticated }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='p-4'>
      <InferenceItem />
    </div>
  )
}
