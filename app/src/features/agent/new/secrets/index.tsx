//import { Link } from '@tanstack/react-router'
//import { Card } from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
//import { Upload, FileText, Layout } from "lucide-react";
import AgentConfigSecrets from '@/components/agent-config-secrets'

export default function NewAgentSecrets() {
  return (
    <>
    <Header fixed>
    <Search />
    <div className='ml-auto flex items-center space-x-4'>
    <ThemeSwitch />
    <ProfileDropdown />
    </div>
    </Header>
    <Main className="sm:px-6 sm:py-16 text-white pt-[5vh] dark:text-gray-100">
    <AgentConfigSecrets />
    </Main>
    </>
  )
}