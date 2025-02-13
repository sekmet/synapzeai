import { Button } from '@/components/ui/button'
import { useAgents } from './context/agents-context'
import { IconTrash } from '@tabler/icons-react'
import { useState, useEffect } from 'react'
import { Agent } from '@/stores/agentActive'

export function AgentDelete() {
  const [agentToDelete, setAgentToDelete] = useState<Agent | null>(null) 
  const { setOpen, setCurrentAgent } = useAgents()

  useEffect(() => {
    setCurrentAgent(agentToDelete)
  }, [agentToDelete, setAgentToDelete])

  return (
    <div className='mb-4 w-full'>
    <p className='text-sm text-muted-foreground mb-3'>
    This action cannot be undone. This will permanently delete your
    agent and remove your data from our servers.
    </p>
    <Button
      variant='outline'
      className='space-x-1 text-red-500'
      onClick={() => setOpen('delete')}
    >
      <span>Delete Agent</span> <IconTrash size={18} />
    </Button>
    </div>
  )
}