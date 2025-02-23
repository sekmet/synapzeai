import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import AgentSelectTemplate from '@/components/agent-select-template'

export default function SelectAgentTemplate() {
  return (
    <>
    <Header fixed>
    <Search />
    <div className='ml-auto flex items-center space-x-4'>
    <ThemeSwitch />
    <ProfileDropdown />
    </div>
    </Header>
    <Main className="px-6 py-16 text-white pt-[5vh] dark:text-gray-100">
    <AgentSelectTemplate />
    </Main>
    </>
  )
}