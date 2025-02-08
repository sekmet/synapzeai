import { createLazyFileRoute } from '@tanstack/react-router'
import NewAgentFromScracth from '@/features/agent/new/scratch'

export const Route = createLazyFileRoute(
  '/_authenticated/agent/new/from-scracth',
)({
  component: NewAgentFromScracth,
})
