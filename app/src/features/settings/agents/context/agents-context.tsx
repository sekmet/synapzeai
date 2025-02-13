import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { Agent } from '@/stores/agentActive'

type AgentsDialogType = 'create' | 'update' | 'delete' | 'import'

interface AgentsContextType {
  open: AgentsDialogType | null
  setOpen: (str: AgentsDialogType | null) => void
  currentAgent: Agent | null
  setCurrentAgent: React.Dispatch<React.SetStateAction<Agent | null>>
}

const AgentsContext = React.createContext<AgentsContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function AgentsProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<AgentsDialogType>(null)
  const [currentAgent, setCurrentAgent] = useState<Agent | null>(null)
  return (
    <AgentsContext value={{ open, setOpen, currentAgent, setCurrentAgent }}>
      {children}
    </AgentsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAgents = () => {
  const agentsContext = React.useContext(AgentsContext)

  if (!agentsContext) {
    throw new Error('useAgents has to be used within <AgentsContext>')
  }

  return agentsContext
}
