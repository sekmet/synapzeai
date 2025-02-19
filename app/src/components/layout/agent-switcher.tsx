import { Link } from '@tanstack/react-router'
import { ChevronsUpDown, Plus } from 'lucide-react'
import Jazzicon from 'react-jazzicon'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { useAgentActiveStore, Agent } from '@/stores/agentActive'
import { clsx } from 'clsx'
import { stringToUniqueNumber } from '@/lib/utils'

export function AgentSwitcher({
  agents,
}: {
  agents: Agent[]
}) {
  const { isMobile } = useSidebar()
  const { getAgent, setAgent, setRefresh } = useAgentActiveStore((state) => state)
  //const [activeAgent, setActiveAgent] = React.useState(getAgent() ?? agents[0])
  console.log({agents})
  const activeAgent = getAgent() ?? agents[0];
  const setActiveAgent = (agent: Agent) =>  {
    setAgent(agent)
    setRefresh(new Date().getTime())
  }

  return activeAgent ? (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <div className={clsx('flex aspect-square size-8 items-center justify-center rounded-lg', activeAgent.logo ? 'bg-sidebar-primary text-sidebar-primary-foreground' : null)}>
                {activeAgent.logo ? <activeAgent.logo className='size-4' /> : <Jazzicon diameter={32} seed={stringToUniqueNumber(`${activeAgent.name}:${activeAgent.id}`)} />}
              </div>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>
                  {activeAgent.name}
                </span>
                <span className='truncate text-xs'>{activeAgent.plan}</span>
              </div>
              <ChevronsUpDown className='ml-auto' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            align='start'
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className='text-xs text-muted-foreground'>
              Agents
            </DropdownMenuLabel>
            {agents.map((agent, index) => (
              <DropdownMenuItem
                key={agent.name}
                onClick={() => setActiveAgent(agent)}
                className='gap-2 p-2'
              >
                <div className={clsx('flex size-6 items-center justify-center rounded-sm', agent.logo ? 'border' : null)}>
                  {agent.logo ? <agent.logo className='size-4 shrink-0' /> : <Jazzicon diameter={21} seed={stringToUniqueNumber(`${agent.name}:${agent.id}`)} />}
                </div>
                {agent.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <Link to='/agent'>
            <DropdownMenuItem className='gap-2 p-2'>
              <div className='flex size-6 items-center justify-center rounded-md border bg-background'>
                <Plus className='size-4' />
              </div>
              <div className='font-medium text-muted-foreground'>Add agent</div>
            </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  ) : (
    <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size='lg'
          className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
        >
            <div className='font-medium text-muted-foreground'>No Agent Active</div>
          <ChevronsUpDown className='ml-auto' />
        </SidebarMenuButton>
      </DropdownMenuTrigger>        
      <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            align='start'
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <Link to='/agent'>
            <DropdownMenuItem className='gap-2 p-2'>
              <div className='flex size-6 items-center justify-center rounded-md border bg-background'>
                <Plus className='size-4' />
              </div>
              <div className='font-medium text-muted-foreground'>Add agent</div>
            </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>        
  )
}
