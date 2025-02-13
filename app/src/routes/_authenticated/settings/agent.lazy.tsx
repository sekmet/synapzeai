import { createLazyFileRoute } from '@tanstack/react-router'
import SettingsAgent from '@/features/settings/agents'

export const Route = createLazyFileRoute('/_authenticated/settings/agent')({
  component: SettingsAgent,
})