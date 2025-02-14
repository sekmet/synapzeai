import { createLazyFileRoute } from '@tanstack/react-router'
import Logs from '@/features/logs'

export const Route = createLazyFileRoute('/_authenticated/logs/')({
  component: Logs,
})
