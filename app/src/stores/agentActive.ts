import * as React from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Plugin {
    name: string
    enabled: boolean
}

interface Client {
    name: string
    enabled: boolean
}

interface VoiceSettings {
    model: string
}

interface AgentSettings {
    voice: VoiceSettings
}

interface MessageExample {
    user: string
    content: {
        text: string
    }
}

interface AgentConfiguration {
    name: string
    plugins: Plugin[]
    clients: Client[]
    modelProvider: string
    settings: AgentSettings
    bio: string[]
    lore: string[]
    knowledge: string[]
    messageExamples: MessageExample[][]
    postExamples: string[]
    topics: string[]
    style: {
        all: string[]
        chat: string[]
    }
}

export interface Agent {
    id: string
    organization_id: string
    logo?: React.ElementType
    name: string
    description: string
    status: 'active' | 'inactive'
    version: string
    created_at: string
    updated_at: string
    last_active: string | null
    deployment_count: number
    container_id: string
    configuration: AgentConfiguration
    plan?: string
}

interface AgentActiveState {
    agent: Agent | null
    refresh: number
    setAgent: (agent: Agent) => void
    getAgent: () => Agent | null
    setRefresh: (refresh: number) => void
    getRefresh: () => number
    clearAgent: () => void
}

export const useAgentActiveStore = create<AgentActiveState>()(
    persist(
        (set, get) => ({
            agent: null,
            refresh: 0,
            setAgent: (agent: Agent) => set({ agent }),
            getAgent: () => get().agent,
            clearAgent: () => set({ agent: null }),
            setRefresh: (refresh: number) => set({ refresh }),
            getRefresh: () => get().refresh
        }),
        {
            name: 'active-agent',
        }
    )
)