import { createLazyFileRoute } from '@tanstack/react-router'
import Plugins from '@/features/plugins'

export const Route = createLazyFileRoute('/_authenticated/plugins/')({
  component: Plugins,
})
