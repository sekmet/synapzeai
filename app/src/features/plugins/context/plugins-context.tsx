import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { Agent } from '@/stores/agentActive'
import { loadPluginParameters as fetchPluginParameters } from '@/lib/plugins'
import { useAgentActiveStore } from '@/stores/agentActive'
import { PluginInfo } from '@/types/plugins'

type PluginsDialogType = 'install' | 'update' | 'uninstall'

interface PluginsContextType {
  open: PluginsDialogType | null
  setOpen: (str: PluginsDialogType | null) => void
  loadPluginParameters: (pluginName: string) => Promise<PluginInfo | null>
  currentAgent: Agent | null
  selectedPlugin: string | null
  setSelectedPlugin: React.Dispatch<React.SetStateAction<string | null>>
  pluginParameters: PluginInfo | null
  setPluginParameters: React.Dispatch<React.SetStateAction<PluginInfo | null>>
  pluginSecrets: Record<string, string>
  setPluginSecrets: React.Dispatch<React.SetStateAction<Record<string, string>>>
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  pluginPackageName: string | null
  setPluginPackageName: React.Dispatch<React.SetStateAction<string | null>>
}

const PluginsContext = React.createContext<PluginsContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function PluginsProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<PluginsDialogType>(null)
  const [selectedPlugin, setSelectedPlugin] = useState<string | null>(null)
  const [pluginParameters, setPluginParameters] = useState<PluginInfo | null>(null)
  const [pluginSecrets, setPluginSecrets] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [pluginPackageName, setPluginPackageName] = useState<string | null>(null)
  const { getAgent } = useAgentActiveStore((state) => state)
  const currentAgent: Agent | null = getAgent()

  // Load plugin parameters when a plugin is selected
  const loadPluginParameters = async (pluginName: string): Promise<PluginInfo | null> => {
    setIsLoading(true)
    try {
      const pluginInfo = await fetchPluginParameters(pluginName)
      setPluginParameters(pluginInfo)
      
      // Set the plugin package name
      if (pluginInfo) {
        setPluginPackageName(pluginName)
      }
      
      return pluginInfo
    } catch (error) {
      console.error('Error loading plugin parameters:', error)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PluginsContext.Provider value={{ 
      open, 
      setOpen, 
      loadPluginParameters, 
      currentAgent,
      selectedPlugin,
      setSelectedPlugin,
      pluginParameters,
      setPluginParameters,
      pluginSecrets,
      setPluginSecrets,
      isLoading,
      setIsLoading,
      pluginPackageName,
      setPluginPackageName
    }}>
      {children}
    </PluginsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const usePlugins = () => {
  const pluginsContext = React.useContext(PluginsContext)

  if (!pluginsContext) {
    throw new Error('usePlugins has to be used within <PluginsContext>')
  }

  return pluginsContext
}
