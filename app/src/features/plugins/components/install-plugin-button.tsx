import { Button } from "@/components/ui/button";
import { usePlugins } from '../context/plugins-context'
import { 
    type Plugin
  } from '@/types/plugins';

export function InstallPluginButton(
    { plugin } : 
    { 
        plugin: Plugin
    }) {
    
    const { setOpen, setSelectedPlugin, setPluginPackageName, loadPluginParameters } = usePlugins()

    return (
        <Button
        onClick={() => {
          if (!plugin.installed) {
            setSelectedPlugin(plugin.value)
            setPluginPackageName(plugin.package)
            loadPluginParameters(`${plugin.package}`.replace('@elizaos-plugins/', ''))
            setOpen('install')
          }
        }}
        variant="outline"
        size="sm"
        className={`${plugin.installed ? 'border border-blue-300 bg-blue-50 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-950 dark:hover:bg-blue-900' : ''}`}
      >
        {plugin.installed ? 'Installed' : 'Install'}
      </Button>       
    )
}