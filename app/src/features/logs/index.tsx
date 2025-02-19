import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/columns'
import { DataTable } from './components/data-table'
import { LogsDialogs } from './components/logs-dialogs'
//import { LogsPrimaryButtons } from './components/logs-primary-buttons'
import LogsProvider from './context/logs-context'
//import { logs } from './data/logs'
import { useQuery } from "@tanstack/react-query";
import { fetchAgentLogs, convertSplitedArrayToObjectArray } from './data/data'
import { useAgentActiveStore, Agent } from '@/stores/agentActive';
import { IconRobot } from '@tabler/icons-react';

export default function Logs() {
  const { refresh, getAgent, getAgentContainerId} = useAgentActiveStore((state) => state)
  const [logEntries, setLogEntries] = useState<any[]>([])
  const { data: agentLogs } = useQuery({
    queryKey: ['agentLogs', refresh],
    queryFn: () => fetchAgentLogs(getAgentContainerId() ?? ''),
    refetchInterval: 10000
  })

  const activeAgent = getAgent() as Agent ?? null;

  useEffect(() => {
    if (!!agentLogs && !agentLogs?.output) return
    const splitedArray = agentLogs?.output?.split('\n').reverse();
    if (splitedArray !== undefined && splitedArray.length > 0) {
      //console.log(convertSplitedArrayToObjectArray(splitedArray))
      setLogEntries(convertSplitedArrayToObjectArray(splitedArray))
    }
  }, [agentLogs, activeAgent])

  return activeAgent ? (
    <LogsProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between gap-x-4 space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Logs</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of your agent logs.
            </p>
          </div>
          {/*<LogsPrimaryButtons />*/}
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <DataTable data={logEntries} columns={columns} />
        </div>
      </Main>

      <LogsDialogs />
    </LogsProvider>
  ) : (
    <div className='h-svh'>
    <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
      <IconRobot size={72} />
      <h1 className='text-4xl font-bold leading-tight'>No active agent 👀</h1>
      <p className='text-center text-muted-foreground'>
        Please deploy an agent first. <br />
        To start view the agent logs!
      </p>
    </div>
  </div>
  )
}
