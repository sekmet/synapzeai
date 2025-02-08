import { createLazyFileRoute } from '@tanstack/react-router'
import NewAgentTemplate from '@/features/agent/new/template'

export const Route = createLazyFileRoute('/_authenticated/agent/new/template')({
  component: NewAgentTemplate,
})
