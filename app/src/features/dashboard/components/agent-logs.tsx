import { useEffect, useState } from 'react'
import { columns } from '@/features/logs/components/columns'
import { DataTable } from '@/features/logs/components/data-table'
import { LogsDialogs } from '@/features/logs/components/logs-dialogs'
import LogsProvider from '@/features/logs/context/logs-context'
import { useQuery } from "@tanstack/react-query";
import { fetchAgentLogs, convertSplitedArrayToObjectArray } from '@/features/logs/data/data'
import { useAgentActiveStore, Agent } from '@/stores/agentActive';
import { IconRobot } from '@tabler/icons-react';
import { LoadingWidget } from '@/components/loading'

export function AgentLogs() {
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
      setLogEntries(convertSplitedArrayToObjectArray(splitedArray))
    }
  }, [agentLogs, activeAgent])

  return activeAgent ? 
  !agentLogs ? <div className='h-[60vh] flex items-center justify-center'><LoadingWidget caption='Loading logs...' /></div> : (
    <LogsProvider>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <DataTable data={logEntries} columns={columns} />
        </div>
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
