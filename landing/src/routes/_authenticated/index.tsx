import { createFileRoute } from '@tanstack/react-router'
import Landing from '@/features/home'

export const Route = createFileRoute('/_authenticated/')({
  component: Landing,
})
