import { Outlet, useRouter } from '@tanstack/react-router'
import {
  IconBrowserCheck,
  IconNotification,
  IconPalette,
  IconTool,
  IconUser,
  IconRobot
} from '@tabler/icons-react'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import SidebarNav from './components/sidebar-nav'
import { useAuthStore } from '@/stores/authStore'
import { useAgentActiveStore, Agent } from '@/stores/agentActive'
import { ChevronLeft } from 'lucide-react'

export default function Settings() {
  const { getOnboarding } = useAuthStore((state) => state)
  const { getAgent } = useAgentActiveStore((state) => state)
  const router = useRouter()
  const onboarding = !getOnboarding().completed
  const activeAgent = getAgent() as Agent ?? null;

  return (
    <>
      {/* ===== Top Heading ===== */}
      {onboarding ? (
        <Header>
            <button onClick={() => router.navigate({to: '/'})} className="mt-3 flex items-center text-gray-700 dark:text-yellow-300 mb-6 hover:opacity-80">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </button>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>          
        </Header>
      ) : (
        <Header>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      )}

      <Main fixed>
        <div className='space-y-0.5'>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
            Settings
          </h1>
          <p className='text-muted-foreground'>
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <Separator className='my-4 lg:my-6' />
        <div className='flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <aside className='top-0 lg:sticky lg:w-1/5'>
            <SidebarNav items={activeAgent ? sidebarNavItems : sidebarNavItems.filter(item => item.title !== 'Agent')} />
          </aside>
          <div className='flex w-full overflow-y-hidden p-1 pr-4'>
            <Outlet />
          </div>
        </div>
      </Main>
    </>
  )
}

const sidebarNavItems = [
  {
    title: 'Agent',
    icon: <IconRobot size={18} />,
    href: '/settings/agent',
  },
  {
    title: 'Profile',
    icon: <IconUser size={18} />,
    href: '/settings',
  },
  {
    title: 'Account',
    icon: <IconTool size={18} />,
    href: '/settings/account',
  },
  {
    title: 'Appearance',
    icon: <IconPalette size={18} />,
    href: '/settings/appearance',
  },
  {
    title: 'Notifications',
    icon: <IconNotification size={18} />,
    href: '/settings/notifications',
  },
  {
    title: 'Display',
    icon: <IconBrowserCheck size={18} />,
    href: '/settings/display',
  },
]
