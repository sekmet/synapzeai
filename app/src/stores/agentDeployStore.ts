import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AgentEnvironmentVars } from '@/types/agent-enviroment-v1'

export interface AgentPluginsSecrets {
  [section: string]: {
    [key: string]: string
  }
}

interface AgentPlugin {
  name: string
  enabled: boolean
  config?: Record<string, any>
}

interface AgentClient {
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

export interface AgentConfig {
  name: string
  pluginsConfig?: AgentPlugin[]
  plugins?: string[]
  clientsConfig?: AgentClient[]
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

interface AgentProvisioningStatus {
  isProvisioning: boolean
  currentStep: number
  completed?: boolean
}

interface AgentDeploySettings {
    config: AgentConfig | null
    env: AgentEnvironmentVars | null
    secrets: AgentPluginsSecrets | null
    provisioning: AgentProvisioningStatus
    setConfig: (config: AgentConfig | null) => void
    getConfig: () => AgentConfig | null
    updateSettings: (settings: Partial<AgentSettings>) => void
    setEnv: (env: AgentEnvironmentVars) => void
    getEnv: () => AgentEnvironmentVars | null
    updateEnv: (env: Partial<AgentEnvironmentVars>) => void
    setPluginSecrets: (secrets: AgentPluginsSecrets) => void
    getPluginSecrets: () => AgentPluginsSecrets | null
    setProvisioning: (provisioning: AgentProvisioningStatus) => void
    getProvisioning: () => AgentProvisioningStatus
    addPlugin: (pluginConfig: AgentPlugin) => void
    removePlugin: (pluginName: string) => void
    addClient: (clientConfig: AgentClient) => void
    removeClient: (clientName: string) => void
    reset: () => void
}

export interface AgentDeployState extends AgentDeploySettings {}

export const useAgentDeployStore = create<AgentDeployState>()(
  persist(
    (set, get) => ({
        config: null,
        env: null,
        secrets: null,
        provisioning: {
          isProvisioning: false,
          currentStep: 0,
          completed: false
        },
        setConfig: (config) =>
          set((state) => ({ ...state, config })),
        getConfig: () => get().config,
        updateSettings: (settings) =>
          set((state) => ({
            ...state,
            config: state.config
              ? {
                  ...state.config,
                  settings: { ...state.config.settings, ...settings },
                }
              : null,
          })),
        setPluginSecrets: (secrets) =>
          set((state) => ({ ...state, secrets })),
        getPluginSecrets: () => get().secrets,
        setProvisioning: (provisioning) =>
          set((state) => ({ ...state, provisioning })),
        getProvisioning: () => get().provisioning,
        addPlugin: (pluginConfig) =>
          set((state) => ({
            ...state,
            config: state.config
              ? {
                  ...state.config,
                  pluginsConfig: state.config.pluginsConfig ? [...state.config.pluginsConfig, pluginConfig] : [pluginConfig],
                }
              : null,
          })),
        removePlugin: (pluginName) =>
          set((state) => ({
            ...state,
            config: state.config
              ? {
                  ...state.config,
                  pluginsConfig: state.config.pluginsConfig ? state.config.pluginsConfig.filter(
                    (p) => p.name !== pluginName
                  ) : [],
                }
              : null,
          })),
        addClient: (clientConfig) =>
          set((state) => ({
            ...state,
            config: state.config
              ? {
                  ...state.config,
                  clientsConfig: state.config.clientsConfig ? [...state.config.clientsConfig, clientConfig] : [clientConfig],
                }
              : null,
          })),
        removeClient: (clientName) =>
          set((state) => ({
            ...state,
            config: state.config
              ? {
                  ...state.config,
                  clientsConfig: state.config.clientsConfig ? state.config.clientsConfig.filter(
                    (c) => c.name !== clientName
                  ) : [],
                }
              : null,
          })),
        setEnv: (env) =>
          set((state) => ({ ...state, env })),
        getEnv: () => get().env,
        updateEnv: (env) =>
          set((state) => ({
            ...state,
            env: { ...state.env, ...env } as AgentEnvironmentVars,
          })),
        reset: () =>
          set((state) => ({
            ...state,
            config: null,
            env: null,
            secrets: null,
            provisioning: {
              isProvisioning: false,
              currentStep: 0,
              completed: false
            }
          })),
    }),
    {
      name: 'synapze:agent-deployment',
    }
  )
)