import { createLazyFileRoute } from '@tanstack/react-router'
//import SelectAgentTemplate from '@/features/agent/new/template/select'
import NewAgentTemplate from '@/features/agent/new/template'

export const Route = createLazyFileRoute(
  '/_authenticated/agent/new/template/$templateId',
)({
  component: NewAgentTemplate,
})