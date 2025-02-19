import { useEffect } from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavGroup } from '@/components/layout/nav-group'
import { NavUser } from '@/components/layout/nav-user'
import { AgentSwitcher } from '@/components/layout/agent-switcher'
import { sidebarData } from './data/sidebar-data'
import { fetchUserAgents } from '@/lib/api/agent'
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from '@/stores/authStore'
import { useAgentActiveStore } from '@/stores/agentActive'
import { useAgentDeployStore } from '@/stores/agentDeployStore'
import { useSidebar } from '@/components/ui/sidebar'
import { clsx } from 'clsx'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state: sidebarState } = useSidebar()
  const { getUser, getOnboarding } = useAuthStore((state) => state)
  const { getProvisioning } = useAgentDeployStore((state) => state)
  const { refresh } = useAgentActiveStore((state) => state)
  const onboarding = !getOnboarding().completed
  const isProvisioning = getProvisioning().isProvisioning;

  const { data: userAgents } = useQuery({
    queryKey: ['userAgents', refresh],
    queryFn: () => fetchUserAgents(getUser()?.id ?? ''),
  })

  useEffect(() => {
    //console.log({refresh})
  }, [refresh])

  return onboarding || isProvisioning ? null : (
    <Sidebar collapsible='icon' variant='floating' {...props}>
      <SidebarHeader>
        {userAgents ? (
          <AgentSwitcher agents={userAgents ?? {}} />
          ) : (
          <div className={clsx(sidebarState === 'collapsed' ? null : 'px-4 py-3 font-semibold leading-6 text-sm shadow rounded-md text-gray-700 bg-sidebar','inline-flex items-center transition ease-in-out duration-150 cursor-not-allowed')}>
            <svg 
            className={clsx(sidebarState === "collapsed" ? "animate-spin text-orange-500" : "animate-spin -ml-1 mr-3 h-6 w-6 text-orange-500")} 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24">
              <circle className="opacity-25" cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={4} />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className={clsx(sidebarState === "collapsed" ? "hidden" : null)}>Loading...</span>
          </div>
          )}
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={getUser()} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
