import { useEffect, useState } from 'react'
import { IconCheck, IconX } from '@tabler/icons-react'
import { toast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import Jazzicon from 'react-jazzicon'
//import { ChatUser } from '../data/chat-types'
import { Agent } from '@/stores/agentActive'
import { stringToUniqueNumber } from '@/lib/utils'

//type User = Omit<Agent, 'messages'>

type Props = {
  agents: Agent[]
  open: boolean
  onOpenChange: (open: boolean) => void
}
export function NewChat({ agents, onOpenChange, open }: Props) {
  const [selectedAgents, setSelectedAgents] = useState<Agent[]>([])

  const handleSelectAgent = (agent: Agent) => {
    if (!selectedAgents.find((u) => u.id === agent.id)) {
      setSelectedAgents([...selectedAgents, agent])
    } else {
      handleRemoveAgent(agent.id)
    }
  }

  const handleRemoveAgent = (agentId: string) => {
    setSelectedAgents(selectedAgents.filter((agent) => agent.id !== agentId))
  }

  useEffect(() => {
    if (!open) {
      setSelectedAgents([])
    }
    console.log(agents)
  }, [open])

  const onSubmit = () => {
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>
            {JSON.stringify(selectedAgents, null, 2)}
          </code>
        </pre>
      ),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>New message</DialogTitle>
        </DialogHeader>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-wrap items-center gap-2'>
            <span className='text-sm text-zinc-400'>To:</span>
            {selectedAgents.map((agent) => (
              <Badge key={agent.id} variant='default'>
                {agent.name}
                <button
                  className='ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2'
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleRemoveAgent(agent.id)
                    }
                  }}
                  onClick={() => handleRemoveAgent(agent.id)}
                >
                  <IconX className='h-3 w-3 text-muted-foreground hover:text-foreground' />
                </button>
              </Badge>
            ))}
          </div>
          <Command className='rounded-lg border'>
            <CommandInput
              placeholder='Search agent...'
              className='text-foreground'
            />
            <CommandList>
              <CommandEmpty>No agent found.</CommandEmpty>
              <CommandGroup>
                {agents && agents.map((agent) => (
                  <CommandItem
                    key={agent.id}
                    onSelect={() => handleSelectAgent(agent)}
                    className='flex items-center justify-between gap-2'
                  >
                    <div className='flex items-center gap-2'>
                    <div className='h-8 w-8 rounded-full'>
                      <Jazzicon diameter={32} seed={stringToUniqueNumber(`${agent.name}:${agent.id}`)} />
                    </div>
                      {/*<img
                        src={user.profile || '/placeholder.svg'}
                        alt={user.fullName}
                        className='h-8 w-8 rounded-full'
                      />*/}
                      <div className='flex flex-col'>
                        <span className='text-sm font-medium'>
                          {agent.name}
                        </span>
                        <span className='text-xs text-zinc-400'>
                        {`${agent.name} Agent`}
                        </span>
                      </div>
                    </div>

                    {selectedAgents.find((u) => u.id === agent.id) && (
                      <IconCheck className='h-4 w-4' />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
          <Button
            variant={'default'}
            onClick={onSubmit}
            disabled={selectedAgents.length === 0}
          >
            Chat
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
