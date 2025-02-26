import { useEffect } from 'react'

import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
//import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { useAuthStore } from '@/stores/authStore'
//import { RecentSales } from './components/recent-sales'
import { Onboarding } from './components/onboarding'
import { useAgentActiveStore, Agent } from '@/stores/agentActive'
//import { useAgentDeployStore } from '@/stores/agentDeployStore'
//import { useQuery } from "@tanstack/react-query";

export default function OnBoarding() {
  const { getOnboarding, getUser } = useAuthStore((state) => state)
  const onboarding = !getOnboarding().completed
  const { getAgent, refresh } = useAgentActiveStore((state) => state)
  //const { getProvisioning } = useAgentDeployStore((state) => state)
  const activeAgent = getAgent() as Agent

  useEffect(() => {
    console.log(onboarding)
  }, [activeAgent, refresh])


  return getUser()?.id ? (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        {/*<TopNav links={topNav} />*/}
        <div className='ml-auto flex items-center space-x-4'>
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
      <Onboarding />
      </Main>
    </>
  ): null
}
