import { useState, useEffect } from 'react'
import { useAgents } from './context/agents-context'
import { AgentDelete } from './components/agent-delete'
import { useAgentActiveStore, Agent } from '@/stores/agentActive'

export function AgentDanger() {
    const [agentToDelete, setAgentToDelete] = useState<Agent | null>(null)
    const { getAgent } = useAgentActiveStore()
    const { setCurrentAgent } = useAgents()

    useEffect(() => {
        setAgentToDelete(getAgent())
        setCurrentAgent(agentToDelete)
    }, [agentToDelete, setAgentToDelete])

    return (
        <AgentDelete />
    )
}