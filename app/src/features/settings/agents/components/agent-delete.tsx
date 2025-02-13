import { Button } from '@/components/ui/button'
import { useAgents } from '../context/agents-context'
import { IconTrash } from '@tabler/icons-react'

export function AgentDelete() {
  const { setOpen } = useAgents()

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