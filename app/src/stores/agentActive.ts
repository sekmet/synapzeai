import * as React from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Plugin {
    name: string
    enabled: boolean
    config?: Record<string, any>
}

interface Client {
    name: string
    enabled: boolean
    config?: Record<string, any>
}

interface AgentVoiceSettings {
    model: string
    provider?: string
  }
  
interface AgentSettings {
    secrets: Record<string, string>
    voice?: AgentVoiceSettings
    transcriptionProvider?: string
    modelProvider?: string
    customModelEndpoint?: string
}

interface AgentConfiguration {
    name: string
    pluginsConfig?: Plugin[]
    plugins?: string[]
    clientsConfig?: Client[]
    clients?: string[]
    modelProvider: string
    settings: AgentSettings
    system?: string
    bio: string[]
    lore?: string[]
    knowledge?: string[]
    messageExamples?: Array<Array<{
      user: string
      content: {
        text: string
      }
    }>>
    style?: {
      all: string[]
      chat: string[]
      post: string[]
    }
    postExamples?: string[]
    topics?: string[]
    adjectives?: string[]
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
    metadata?: any
    plan?: string
}

interface AgentActiveState {
    agent: Agent | null
    refresh: number
    configuration: AgentConfiguration | null
    setAgent: (agent: Agent) => void
    getAgent: () => Agent | null
    getConfig: () => AgentConfiguration | null
    setConfig: (config: AgentConfiguration) => void
    getAgentContainerId: () => string | null
    getAgentContainerPort: () => number | null
    getAgentOrganizationId: () => string | null
    setRefresh: (refresh: number) => void
    getRefresh: () => number
    clearAgent: () => void
}

export const useAgentActiveStore = create<AgentActiveState>()(
    persist(
        (set, get) => ({
            agent: null,
            refresh: 0,
            configuration: null,
            setAgent: (agent: Agent) => set({ agent }),
            getAgent: () => get().agent,
            setConfig: (config: AgentConfiguration) => set({ configuration: config }),
            getConfig: () => get().agent?.configuration ?? null,
            getAgentContainerId: () => `${get().agent?.container_id}`.split(':')[0] ?? null,
            getAgentContainerPort: () => Number(`${get().agent?.container_id}`.split(':')[1]) ?? null,
            getAgentOrganizationId: () => get().agent?.organization_id ?? null,
            clearAgent: () => set({ agent: null }),
            setRefresh: (refresh: number) => set({ refresh }),
            getRefresh: () => get().refresh
        }),
        {
            name: 'synapze:active-agent',
        }
    )
)