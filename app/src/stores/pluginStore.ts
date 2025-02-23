import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface PluginItem {
    value: string
    label: string
    category: string
    package: string
    description: string
    enabled?: boolean
    config?: Record<string, any>
}

interface PluginStoreState {
    plugins: PluginItem[]
    activePlugins: string[]
    pluginConfigs: Record<string, any>
    setPlugins: (plugins: PluginItem[]) => void
    getPlugins: () => PluginItem[]
    addPlugin: (plugin: PluginItem) => void
    removePlugin: (value: string) => void
    togglePlugin: (value: string, enabled: boolean) => void
    setPluginConfig: (value: string, config: any) => void
    getPluginConfig: (value: string) => any
    getActivePlugins: () => string[]
    setActivePlugins: (plugins: string[]) => void
    clearPlugins: () => void
}

export const usePluginStore = create<PluginStoreState>()(
    persist(
        (set, get) => ({
            plugins: [],
            activePlugins: [],
            pluginConfigs: {},
            
            setPlugins: (plugins: PluginItem[]) => set({ plugins }),
            getPlugins: () => get().plugins,
            
            addPlugin: (plugin: PluginItem) => {
                const plugins = [...get().plugins]
                const index = plugins.findIndex(p => p.value === plugin.value)
                if (index === -1) {
                    plugins.push(plugin)
                    set({ plugins })
                }
            },
            
            removePlugin: (value: string) => {
                const plugins = get().plugins.filter(p => p.value !== value)
                const activePlugins = get().activePlugins.filter(p => p !== value)
                set({ plugins, activePlugins })
            },
            
            togglePlugin: (value: string, enabled: boolean) => {
                const activePlugins = [...get().activePlugins]
                const index = activePlugins.indexOf(value)
                
                if (enabled && index === -1) {
                    activePlugins.push(value)
                } else if (!enabled && index !== -1) {
                    activePlugins.splice(index, 1)
                }
                
                set({ activePlugins })
            },
            
            setPluginConfig: (value: string, config: any) => {
                const pluginConfigs = {
                    ...get().pluginConfigs,
                    [value]: config
                }
                set({ pluginConfigs })
            },
            
            getPluginConfig: (value: string) => get().pluginConfigs[value],
            
            getActivePlugins: () => get().activePlugins,
            setActivePlugins: (plugins: string[]) => set({ activePlugins: plugins }),
            
            clearPlugins: () => set({ 
                plugins: [], 
                activePlugins: [], 
                pluginConfigs: {} 
            })
        }),
        {
            name: 'plugin-store',
        }
    )
)