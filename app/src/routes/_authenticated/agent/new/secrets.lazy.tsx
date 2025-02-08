import { createLazyFileRoute } from '@tanstack/react-router'
import NewAgentSecrets from '@/features/agent/new/secrets'

export const Route = createLazyFileRoute(
  '/_authenticated/agent/new/secrets',
)({
  component: NewAgentSecrets,
})
