import { toast } from '@/hooks/use-toast'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useAgents } from '../context/agents-context'
import { useNavigate } from '@tanstack/react-router'
//import { AgentsImportDialog } from './agents-import-dialog'
//import { AgentsMutateDrawer } from './agents-mutate-drawer'
import { useQuery } from "@tanstack/react-query";
import { fetchUserAgents } from '@/components/layout/data/sidebar-data'
import { useAgentActiveStore } from '@/stores/agentActive'
import { deleteAgent, deleteAgentDeployment } from '@/lib/api/agent'

export function AgentsDialogs() {
  const { open, setOpen, currentAgent, setCurrentAgent } = useAgents()
  const { setRefresh, refresh, setAgent } = useAgentActiveStore()
  const navigate = useNavigate()

  const { data: userAgentsActive } = useQuery({
    queryKey: ['userAgentsActive', refresh],
    queryFn: () => fetchUserAgents(currentAgent?.id ?? ''),
  })

  return (
    <>
      {/*<AgentsMutateDrawer
        key='agent-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      <AgentsImportDialog
        key='agents-import'
        open={open === 'import'}
        onOpenChange={() => setOpen('import')}
      />*/}

      {currentAgent && (
        <>
          {/*<AgentsMutateDrawer
            key={`agent-update-${currentAgent.id}`}
            open={open === 'update'}
            onOpenChange={() => {
              setOpen('update')
              setTimeout(() => {
                setCurrentAgent(null)
              }, 500)
            }}
            currentAgent={currentAgent}
          />*/}

          <ConfirmDialog
            key='agent-delete'
            destructive
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              /*setTimeout(() => {
                setCurrentAgent(null)
              }, 500)*/
            }}
            handleConfirm={() => {
              setOpen(null)
              setTimeout(() => {
                deleteAgentDeployment(currentAgent.id, currentAgent.metadata.composePath)
                deleteAgent(currentAgent.id)
                setRefresh(new Date().getTime())
                setCurrentAgent(null)
                setAgent(userAgentsActive[0])
              }, 500)
              setTimeout(() => {
                navigate({ to: '/' })
              }, 500)
              toast({
                title: 'The following agent has been deleted:',
                description: (
                  <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
                    <code className='text-white'>
                      {JSON.stringify({id: currentAgent.id, name: currentAgent.name}, null, 2)}
                    </code>
                  </pre>
                ),
              })
            }}
            className='max-w-md'
            title={`Delete this agent: ${currentAgent.name} ?`}
            desc={
              <>
                You are about to delete a agent with the ID{' '}
                <strong>{currentAgent.id}</strong>. <br />
                This action cannot be undone.
              </>
            }
            confirmText='Delete'
          />
        </>
      )}
    </>
  )
}
