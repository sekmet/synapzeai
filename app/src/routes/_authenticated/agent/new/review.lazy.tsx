import { createLazyFileRoute } from '@tanstack/react-router'
import NewAgentReview from '@/features/agent/new/review'

export const Route = createLazyFileRoute(
  '/_authenticated/agent/new/review',
)({
  component: NewAgentReview,
})
