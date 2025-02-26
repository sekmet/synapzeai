import { useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  //CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
//import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Overview } from './components/overview'
import { UpdateAgent } from './components/update-agent'
import { AgentLogs } from './components/agent-logs'
import { useAuthStore } from '@/stores/authStore'
//import { RecentSales } from './components/recent-sales'
import { ProvisioningSteps } from './components/provisioning'
import { IconRobot, IconChartPie, IconLogs, IconPencil } from '@tabler/icons-react';
import { useAgentActiveStore, Agent } from '@/stores/agentActive'
import { useAgentDeployStore } from '@/stores/agentDeployStore'
import { useQuery } from "@tanstack/react-query";
import { 
  getEngagedSessions, 
  getSessionsRejectedTime, 
  getTransferRate, 
  getAvgSessionHandleTime, 
  getAvgCsat, 
  getAvgSessionSentiment 
} from '@/lib/api/reports'

export default function Dashboard() {
  const { getUser } = useAuthStore((state) => state)
  const { getAgent, getAgentContainerId, refresh } = useAgentActiveStore((state) => state)
  const { getProvisioning } = useAgentDeployStore((state) => state)
  const activeAgent = getAgent() as Agent
  const isProvisioning = getProvisioning().isProvisioning;

  const { data: engagedSessions } = useQuery({
    queryKey: ['engagedSessions', refresh],
    queryFn: () => activeAgent ? getEngagedSessions(getAgentContainerId() ?? '') : [],
  });

  const { data: rejectedSessions } = useQuery({
    queryKey: ['rejectedSessions', refresh],
    queryFn: () => activeAgent ? getSessionsRejectedTime(getAgentContainerId() ?? '') : [],
  });

  const { data: transferRate } = useQuery({
    queryKey: ['transferRate', refresh],
    queryFn: () => activeAgent ? getTransferRate(getAgentContainerId() ?? '') : [],
  });

  const { data: avgHandleTime } = useQuery({
    queryKey: ['avgHandleTime', refresh],
    queryFn: () => activeAgent ? getAvgSessionHandleTime(getAgentContainerId() ?? '') : [],
  });

  const { data: avgCsat } = useQuery({
    queryKey: ['avgCsat', refresh],
    queryFn: () => activeAgent ? getAvgCsat(getAgentContainerId() ?? '') : [],
  });

  const { data: avgSentiment } = useQuery({
    queryKey: ['avgSentiment', refresh],
    queryFn: () => activeAgent ? getAvgSessionSentiment(getAgentContainerId() ?? '') : [],
  });


  useEffect(() => {
  }, [activeAgent, refresh])


  return activeAgent && getUser()?.id ? (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        {/*<TopNav links={topNav} />*/}
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
          <>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
          <div className='flex items-center space-x-2'>
          <Link to='/agent/new'>
            <Button><IconRobot /> New Agent</Button>
          </Link> 
          </div>
        </div>
        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='overview'>
                <IconChartPie size={21} className='mr-1' /> <span className='hidden sm:block'>Overview</span>
              </TabsTrigger>
              <TabsTrigger value='agent-details' disabled>
              <IconRobot size={21} className='mr-1' /> <span className='hidden sm:block'>Details</span>
              </TabsTrigger>
              <TabsTrigger value='agent-logs'>
                <IconLogs size={21} className='mr-1' /> <span className='hidden sm:block'>Logs</span>
              </TabsTrigger>
              <TabsTrigger value='update-agent'>
                <IconPencil size={21} className='mr-1' /> <span className='hidden sm:block'>Update Agent</span>
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6'>
            {engagedSessions && (<Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 p-4 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Engaged sessions
                  </CardTitle>
                </CardHeader>
                <CardContent className='px-4 pb-4'>
                  <div className='text-2xl font-bold leading-none'>{engagedSessions[0]?.engaged_sessions ?? 0}</div>
                  <p className='text-xs text-muted-foreground mt-1'>0.0%</p>
                </CardContent>
              </Card>)}
              {rejectedSessions && (<Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 p-4 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Sessions rejected/time
                  </CardTitle>
                </CardHeader>
                <CardContent className='px-4 pb-4'>
                  <div className='text-2xl font-bold leading-none'>{rejectedSessions[0]?.sessions_rejected_percentage ?? 0}%</div>
                  <p className='text-xs text-muted-foreground mt-1'>0.0%</p>
                </CardContent>
              </Card>)}
              {transferRate && (<Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 p-4 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Transfer rate
                  </CardTitle>
                </CardHeader>
                <CardContent className='px-4 pb-4'>
                  <div className='text-2xl font-bold leading-none'>{transferRate[0]?.transfer_rate ?? 0}%</div>
                  <p className='text-xs text-muted-foreground mt-1'>0.0%</p>
                </CardContent>
              </Card>)}
              {avgHandleTime && (<Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 p-4 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Avg. session handle time
                  </CardTitle>
                </CardHeader>
                <CardContent className='px-4 pb-4'>
                  <div className='text-2xl font-bold leading-none'>{avgHandleTime[0]?.avg_handle_time_percentage ?? 0}%</div>
                  <p className='text-xs text-muted-foreground mt-1'>0.0%</p>
                </CardContent>
              </Card>)}
              {avgCsat && (<Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 p-4 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Avg. CSAT
                  </CardTitle>
                </CardHeader>
                <CardContent className='px-4 pb-4'>
                  <div className='text-2xl font-bold leading-none'>{avgCsat[0]?.avg_csat ?? 0}%</div>
                  <p className='text-xs text-muted-foreground mt-1'>0.0%</p>
                </CardContent>
              </Card>)}
              {avgSentiment && (<Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 p-4 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Avg. session sentiment
                  </CardTitle>
                </CardHeader>
                <CardContent className='px-4 pb-4'>
                  <div className='text-2xl font-bold leading-none'>{avgSentiment[0]?.avg_session_sentiment_percentage ?? 0}%</div>
                  <p className='text-xs text-muted-foreground mt-1'>0.0%</p>
                </CardContent>
              </Card>)}
            </div>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-2'>
              <Card className='h-[300px]'>
                <CardHeader>
                  <CardTitle>Engaged sessions</CardTitle>
                </CardHeader>
                <CardContent className='pl-2 h-[300px] sm:h-[350px]'>
                  <Overview chartType="engaged" />
                </CardContent>
              </Card>
              <Card className='h-[300px]'>
                <CardHeader>
                  <CardTitle>Avg. time between interactions (min)</CardTitle>
                </CardHeader>
                <CardContent className='pl-2 h-[300px] sm:h-[350px]'>
                  <Overview chartType="handleTime" />
                </CardContent>
              </Card>
              <Card className='h-[300px]'>
                <CardHeader>
                  <CardTitle>Avg. CSAT</CardTitle>
                </CardHeader>
                <CardContent className='pl-2 h-[300px] sm:h-[350px]'>
                  <Overview chartType="csat" />
                </CardContent>
              </Card>
              <Card className='h-[300px]'>
                <CardHeader>
                  <CardTitle>Sentiment zones</CardTitle>
                </CardHeader>
                <CardContent className='px-4 pb-4'>
                  <Overview chartType="sentiment" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value='update-agent' className='space-y-4'>
            <UpdateAgent />
          </TabsContent>
          <TabsContent value='agent-logs' className='space-y-4'>
            <AgentLogs />
          </TabsContent>
        </Tabs>
        </>
      </Main>
    </>
  ) : getUser()?.id ? (
    isProvisioning ? (
      (
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
        <div className='h-svh'>
        <div className='m-auto flex h-[90vh] w-full flex-col items-center justify-center gap-2'>
          <ProvisioningSteps />
        </div>
      </div>
      </Main>
        </>
      )
    ) : (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        {/*<TopNav links={topNav} />*/}
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
    <div className='h-svh'>
    <div className='m-auto flex h-[60vh] w-full flex-col items-center justify-center gap-2'>
      <IconRobot size={72} />
      <h1 className='text-4xl font-bold leading-tight'>No active agent 👀</h1>
      <p className='text-center text-muted-foreground'>
        Please deploy an agent first. <br />
        To start a chat with it!
      </p>
      <div className='flex items-center space-x-2'>
          <Link to='/agent/new'>
            <Button>Deploy a New Agent</Button>
          </Link> 
          </div>

    </div>
  </div>
  </Main>
    </>
  )
) : null
}

/*const topNav = [
  {
    title: 'Overview',
    href: 'dashboard/overview',
    isActive: true,
    disabled: false,
  },
  {
    title: 'Customers',
    href: 'dashboard/customers',
    isActive: false,
    disabled: true,
  },
  {
    title: 'Products',
    href: 'dashboard/products',
    isActive: false,
    disabled: true,
  },
  {
    title: 'Settings',
    href: 'dashboard/settings',
    isActive: false,
    disabled: true,
  },
]*/
