import { createLazyFileRoute } from '@tanstack/react-router'
import NewAgentUpload from '@/features/agent/new/upload'

export const Route = createLazyFileRoute('/_authenticated/agent/new/upload')({
  component: NewAgentUpload,
})
