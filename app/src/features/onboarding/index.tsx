import { useEffect } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from '@tanstack/react-router'
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
  const router = useRouter()
  const { getUser } = useAuthStore((state) => state)
  const onboarding = Cookies.get('synapze:onboarding') !== 'false'
  const { getAgent, refresh } = useAgentActiveStore((state) => state)
  //const { getProvisioning } = useAgentDeployStore((state) => state)
  const activeAgent = getAgent() as Agent

  if (!onboarding) {
    router.navigate({ to: '/' })
  }


  useEffect(() => {
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
