import { useState, useEffect } from 'react'
import { toast } from '@/hooks/use-toast'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { usePlugins } from '../context/plugins-context'
import { installElizav1Plugin } from '@/lib/api/agent'
import { useAgentActiveStore } from '@/stores/agentActive'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'

export function InstallPluginDialog() {
  const { 
    open, 
    setOpen, 
    currentAgent,
    selectedPlugin,
    //setSelectedPlugin,
    pluginParameters,
    setPluginParameters,
    pluginSecrets,
    setPluginSecrets,
    isLoading,
    setIsLoading,
    pluginPackageName,
    //setPluginPackageName,
    loadPluginParameters
  } = usePlugins()
  const { setRefresh } = useAgentActiveStore((state) => state)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isInstalling, setIsInstalling] = useState(false)

  // Reset form when dialog closes
  useEffect(() => {
    if (open !== 'install') {
      setPluginSecrets({})
      setFormErrors({})
      setPluginParameters(null)
    }
  }, [open, setPluginSecrets, setPluginParameters])

  // Load plugin parameters when dialog opens
  useEffect(() => {
    if (open === 'install' && selectedPlugin && pluginPackageName) {
      setIsLoading(true)
      setPluginSecrets({})
      setFormErrors({})
      
      loadPluginParameters(`${pluginPackageName}`.replace('@elizaos-plugins/', ''))
        .then(pluginInfo => {
          setPluginParameters(pluginInfo)
          
          // Initialize plugin secrets with empty values
          if (pluginInfo?.agentConfig?.pluginParameters) {
            const initialSecrets: Record<string, string> = {}
            Object.keys(pluginInfo.agentConfig.pluginParameters).forEach(key => {
              initialSecrets[key] = ''
            })
            setPluginSecrets(initialSecrets)
          }
        })
        .catch(error => {
          console.error('Error loading plugin parameters:', error)
          toast({
            title: 'Error',
            description: 'Failed to load plugin parameters',
            variant: 'destructive',
          })
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [open, selectedPlugin, pluginPackageName])

  // Handle form input changes
  const handleInputChange = (key: string, value: string) => {
    setPluginSecrets(prev => ({
      ...prev,
      [key]: value
    }))
    
    // Clear error for this field if it exists
    if (formErrors[key]) {
      setFormErrors(prev => {
        const newErrors = {...prev}
        delete newErrors[key]
        return newErrors
      })
    }
  }

  // Validate form before submission
  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    // Check if plugin parameters exist and are required
    if (pluginParameters?.agentConfig?.pluginParameters) {
      const params = pluginParameters.agentConfig.pluginParameters
      
      // Validate each parameter
      Object.entries(params).forEach(([key, param]) => {
        const value = pluginSecrets[key]
        
        // Check if field is required (all fields are required for this implementation)
        if (!value || value.trim() === '') {
          errors[key] = 'This field is required'
        } else if (typeof param.minLength === 'number' && value.length < param.minLength) {
          errors[key] = `Minimum length is ${param.minLength} characters`
        } else if (typeof param.maxLength === 'number' && value.length > param.maxLength) {
          errors[key] = `Maximum length is ${param.maxLength} characters`
        }
        
        // Additional type validation
        if (typeof param.type === 'string') {
          if (param.type === 'number' && isNaN(Number(value))) {
            errors[key] = 'This field must be a number'
          }
        }
      })
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Install the plugin
  const installPlugin = async () => {
    if (!currentAgent || !pluginPackageName) {
      toast({
        title: 'Error',
        description: 'Agent or plugin not selected',
        variant: 'destructive'
      })
      return
    }
    
    // Validate form
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }
    
    setIsInstalling(true)
    try {
      // Call the installElizav1Plugin function
      const result = await installElizav1Plugin(
        currentAgent.id,
        pluginPackageName,
        pluginSecrets
      )
      
      if (result) {
        toast({
          title: 'Success',
          description: `Plugin ${selectedPlugin} has been installed successfully`,
        })
        setOpen(null)
        setRefresh(new Date().getTime())
      } else {
        toast({
          title: 'Error',
          description: 'Failed to install plugin',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error installing plugin:', error)
      toast({
        title: 'Error',
        description: `Failed to install plugin: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive'
      })
    } finally {
      setIsInstalling(false)
    }
  }

  return (
    <ConfirmDialog
      key='plugin-install'
      open={open === 'install'}
      onOpenChange={() => setOpen(open === 'install' ? null : 'install')}
      handleConfirm={installPlugin}
      className='max-w-md max-h-[90vh] overflow-hidden'
      title={`Install Plugin${selectedPlugin ? `: ${selectedPlugin}` : ''}`}
      desc={
        <div className="space-y-4 mt-4">
          {currentAgent ? (
            <div className="mb-4 p-2 bg-muted rounded-md">
              <p className="text-sm font-medium">Installing plugin for agent: <span className="font-bold">{currentAgent.name}</span></p>
            </div>
          ) : (
            <div className="mb-4 p-2 bg-yellow-100 dark:bg-yellow-900 rounded-md">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">No active agent selected. Please select an agent first.</p>
            </div>
          )}
          
          {selectedPlugin && (
            <div className="mb-4 p-2 bg-muted rounded-md">
              <p className="text-sm font-medium">Plugin: <span className="font-bold">{selectedPlugin}</span></p>
              {pluginPackageName && <p className="text-xs text-muted-foreground">Package: {pluginPackageName}</p>}
            </div>
          )}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
          
          {/* Plugin Parameters Form */}
          {!isLoading && pluginParameters?.agentConfig?.pluginParameters && (
            <>
            <h3 className="font-semibold bg-muted p-2 rounded-md">Plugin Parameters</h3>
            <div className="space-y-4 border p-4 rounded-md max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {Object.entries(pluginParameters.agentConfig.pluginParameters).map(([key, param]) => (
                <div key={key} className="space-y-1 mb-4">
                  <Label htmlFor={key} className="block mb-1">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                    {param.description && <span className="text-xs text-muted-foreground ml-1">({param.description})</span>}
                  </Label>
                  {typeof param.type === 'string' && param.type === 'string' && param.maxLength && param.maxLength > 100 ? (
                    <Textarea
                      id={key}
                      value={pluginSecrets[key] || ''}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      className={`w-full ${formErrors[key] ? 'border-red-500' : ''}`}
                      placeholder={`Enter ${key}`}
                    />
                  ) : (
                    <Input
                      id={key}
                      type={typeof param.type === 'string' && param.type === 'number' ? 'number' : 'text'}
                      value={pluginSecrets[key] || ''}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      className={`w-full ${formErrors[key] ? 'border-red-500' : ''}`}
                      placeholder={`Enter ${key}`}
                    />
                  )}
                  {formErrors[key] && (
                    <p className="text-xs text-red-500 mt-1">{formErrors[key]}</p>
                  )}
                </div>
              ))}
            </div>
            </>
          )}
          
          {/* No parameters message */}
          {!isLoading && selectedPlugin && !pluginParameters?.agentConfig?.pluginParameters && (
            <div className="text-sm text-muted-foreground">
              This plugin does not require any parameters.
            </div>
          )}
        </div>
      }
      confirmText={
        isInstalling ? (
          <div className="flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Installing...
          </div>
        ) : 'Install'
      }
      cancelBtnText="Cancel"
      disabled={isInstalling || !currentAgent}
    />
  )
}

export function PluginsDialogs() {
  return (
    <>
      <InstallPluginDialog />
    </>
  )
}
