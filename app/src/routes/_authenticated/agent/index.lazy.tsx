import { createLazyFileRoute } from '@tanstack/react-router'
import NewAgent from '@/features/agent/new'

export const Route = createLazyFileRoute('/_authenticated/agent/')({
  component: NewAgent,
})
