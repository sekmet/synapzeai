import { createLazyFileRoute } from '@tanstack/react-router'
//import NewAgentTemplate from '@/features/agent/new/template'
import SelectAgentTemplate from '@/features/agent/new/template/select'

export const Route = createLazyFileRoute('/_authenticated/agent/new/template/')(
  {
    component: SelectAgentTemplate,
  },
)
