import { toast } from '@/hooks/use-toast'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useAgents } from '../context/agents-context'
//import { AgentsImportDialog } from './agents-import-dialog'
//import { AgentsMutateDrawer } from './agents-mutate-drawer'

export function AgentsDialogs() {
  const { open, setOpen, currentAgent, setCurrentAgent } = useAgents()
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
              setTimeout(() => {
                setCurrentAgent(null)
              }, 500)
            }}
            handleConfirm={() => {
              setOpen(null)
              setTimeout(() => {
                setCurrentAgent(null)
              }, 500)
              toast({
                title: 'The following agent has been deleted:',
                description: (
                  <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
                    <code className='text-white'>
                      {JSON.stringify(currentAgent.id, null, 2)}
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
