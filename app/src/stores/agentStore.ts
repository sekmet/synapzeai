import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Agent } from './agentActive'

interface AgentStoreState {
    agents: Agent[]
    setAgents: (agents: Agent[]) => void
    addAgent: (agent: Agent) => void
    removeAgent: (agentId: string) => void
    getAgentById: (agentId: string) => Agent | undefined
    getAgentByName: (name: string) => Agent | undefined
    getAgents: () => Agent[]
    clearAgents: () => void
}

export const useAgentStore = create<AgentStoreState>()(
    persist(
        (set, get) => ({
            agents: [],
            setAgents: (agents: Agent[]) => set({ agents }),
            addAgent: (agent: Agent) => {
                const agents = get().agents
                const existingAgentIndex = agents.findIndex(a => a.id === agent.id)
                if (existingAgentIndex >= 0) {
                    // Update existing agent
                    const updatedAgents = [...agents]
                    updatedAgents[existingAgentIndex] = agent
                    set({ agents: updatedAgents })
                } else {
                    // Add new agent
                    set({ agents: [...agents, agent] })
                }
            },
            removeAgent: (agentId: string) => {
                const agents = get().agents
                set({ agents: agents.filter(agent => agent.id !== agentId) })
            },
            getAgentById: (agentId: string) => {
                return get().agents.find(agent => agent.metadata.agentClientId === agentId || agent.id === agentId)
            },
            getAgentByName: (name: string) => {
                return get().agents.find(agent => agent.name === name)
            },
            getAgents: () => get().agents,
            clearAgents: () => set({ agents: [] })
        }),
        {
            name: 'synapze:agents',
        }
    )
)
