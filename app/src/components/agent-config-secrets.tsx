import { Link } from '@tanstack/react-router'
import { useRouter, useCanGoBack } from '@tanstack/react-router'
import { useState, useEffect } from "react";
import { ChevronLeft, X, Check, ChevronDown } from "lucide-react";
//import { getAgentEnvironmentFields } from '@/lib/templates';
import { capitalizeSpecificWords, uppercaseSpecificWords } from '@/lib/utils';
import { useAgentDeployStore, AgentPluginsSecrets } from '@/stores/agentDeployStore';
import { Input } from "@/components/ui/input"
//import { Button } from "@/components/ui/button"

interface AdditionalSecret {
  id: number;
  section: string;
  key: string;
  value: string;
}

export default function AgentConfigSecrets() {
    const router = useRouter()
    const canGoBack = useCanGoBack()
    const { getConfig, getPluginSecrets, updateSettings } = useAgentDeployStore((state) => state)

  const [additionalSecrets, setAdditionalSecrets] = useState<AdditionalSecret[]>([
    {
      id: 1,
      section: "",
      key: "",
      value: ""
    }
  ]);

  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({});

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const addSecret = (section: string = "") => {
    const newId = Math.max(0, ...additionalSecrets.map(s => s.id)) + 1;
    setAdditionalSecrets([...additionalSecrets, {
      id: newId,
      section,
      key: "",
      value: ""
    }]);
  };

  const removeSecret = (id: number) => {
    setAdditionalSecrets(additionalSecrets.filter(secret => secret.id !== id));
  };

  const updateSecret = (id: number, field: "section" | "key" | "value", value: string) => {
    setAdditionalSecrets(additionalSecrets.map(secret => secret.id === id ? {
      ...secret,
      [field]: value
    } : secret));
  };

  // TODO: handle plugin config and secrets setups
  let characterConfig = getConfig();
  delete characterConfig?.pluginsConfig;
  delete characterConfig?.clientsConfig;

  let pluginSecrets = getPluginSecrets();

  // Effect to save state changes
  useEffect(() => {
    if (!pluginSecrets) return;

    const updatedSecrets = async () => {
      // process plugins secrets to extract alls secrets
      const secretsToExtract: any = {};
      // Properly iterate through the nested structure
      for (const sectionPlugin in pluginSecrets) {
        const plugin = pluginSecrets[sectionPlugin as keyof typeof pluginSecrets];
        if (typeof plugin === 'object' && plugin !== null) {
          Object.entries(plugin).forEach(envPair => {
            Object.assign(secretsToExtract, { [envPair[0]]: envPair[1] });
          });
        }
      }
    
      updateSettings({
        secrets: secretsToExtract
      })
    }

    updatedSecrets()
  }, [pluginSecrets])

return (
  <div className="min-h-screen bg-background text-foreground w-full p-8">
      <div className="max-w-full mx-auto">
        <div className="mb-8">
        {canGoBack ? (
            <button onClick={() => router.history.back()} className="flex items-center text-yellow-500 dark:text-yellow-400 mb-6 hover:opacity-80">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Characters
          </button>
        ): null}
          <h1 className="text-3xl font-semibold mt-4">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Add the secrets for any services your AI agent will access,
            including LLMs. Click here to view all the supported secrets.
          </p>
        </div>
        <div className="space-y-6">
          <div className="border rounded-lg p-6">
            <h2 className="font-medium mb-4">Environment Variables</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Configure environment variables for your model and client integrations.
            </p>
            <div className="space-y-6">
              {Object.entries(useAgentDeployStore.getState().env || {}).map(([section, variables]) => {
                // Skip empty sections
                if (Object.keys(variables).length === 0) return null;

                // Format section name for display
                const displayName = uppercaseSpecificWords(capitalizeSpecificWords(section.charAt(0).toUpperCase() + section.slice(1)));

                return (
                  <div key={section} className="border rounded-lg p-4">
                    <button
                      onClick={() => toggleSection(section)}
                      className="flex items-center justify-between w-full text-left mb-4"
                    >
                      <h3 className="font-medium">{displayName} Configuration</h3>
                      <ChevronDown
                        className={`w-5 h-5 transform transition-transform ${expandedSections[section] ? 'rotate-180' : ''}`}
                      />
                    </button>
                    
                    {expandedSections[section] && (
                      <div className="space-y-4">
                        {Object.entries(variables).map(([key, value]) => {
                          // Format key for display by removing section prefix and underscores
                          const displayKey = key
                            /*.replace(new RegExp(`^${section.toUpperCase()}_`), '')
                            .split('_')
                            .map(word => word.charAt(0) + word.slice(1).toLowerCase())
                            .join(' ');*/

                          return (
                            <div key={`${section}-${key}`} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="text-sm font-semibold text-muted-foreground">{displayKey}</div>
                              <Input
                                type="text"
                                className="w-full px-3 py-1 rounded border bg-background text-foreground"
                                placeholder="Enter value..."
                                value={value as string}
                                onChange={(e) => {
                                  const agentDeploy = useAgentDeployStore.getState();
                                  const newEnv: any = { ...agentDeploy.env };
                                  newEnv[section][key] = e.target.value;
                                  agentDeploy.setEnv(newEnv);
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="border rounded-lg p-6">
            <h2 className="font-medium mb-4">Plugin Secrets</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Manage secrets for your plugins and additional configurations.
            </p>
            <div className="space-y-6">
              {Object.entries(pluginSecrets as AgentPluginsSecrets).map(([section, secrets]) => (
                <div key={section} className="border rounded-lg p-4">
                  <button
                    onClick={() => toggleSection(section)}
                    className="flex items-center justify-between w-full text-left mb-4"
                  >
                    <h3 className="font-medium">{section}</h3>
                    <ChevronDown
                      className={`w-5 h-5 transform transition-transform ${expandedSections[section] ? 'rotate-180' : ''}`}
                    />
                  </button>
                  
                  {expandedSections[section] && (
                    <div className="space-y-4">
                      {secrets && Object.entries(secrets).map(([key, value]) => (
                        <div key={`${section}-${key}`} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Input
                            type="text"
                            disabled={true}
                            className="w-full px-3 py-1 rounded border bg-background text-foreground"
                            value={key}
                          />
                          <div className="flex gap-2">
                            <Input
                              type="text"
                              className="w-full px-3 py-1 rounded border bg-background text-foreground"
                              placeholder="Enter value..."
                              value={value}
                              onChange={(e) => {
                                const agentDeploy = useAgentDeployStore.getState();
                                const newSecrets = { ...pluginSecrets };
                                newSecrets[section][key] = e.target.value;
                                agentDeploy.setPluginSecrets(newSecrets);
                              }}
                            />
                            <button className="p-2 text-sm text-muted-foreground hover:text-foreground">
                              <Check size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => addSecret(section)}
                        className="text-sm text-primary hover:text-primary/80"
                      >
                        + Add secret to {section}
                      </button>
                    </div>
                  )}
                </div>
              ))}

              <div className="mt-6">
                <h3 className="font-medium mb-4">Additional Secrets</h3>
                <div className="space-y-4">
                  {additionalSecrets.map(secret => (
                    <div key={secret.id} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Input
                        type="text"
                        className="w-full px-3 py-1 rounded border bg-background text-foreground"
                        placeholder="Enter section..."
                        value={secret.section}
                        onChange={e => updateSecret(secret.id, "section", e.target.value)}
                      />
                      <Input
                        type="text"
                        className="w-full px-3 py-1 rounded border bg-background text-foreground"
                        placeholder="Enter key..."
                        value={secret.key}
                        onChange={e => updateSecret(secret.id, "key", e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          className="w-full px-3 py-1 rounded border bg-background text-foreground"
                          placeholder="Enter value..."
                          value={secret.value}
                          onChange={e => updateSecret(secret.id, "value", e.target.value)}
                        />
                        <button
                          onClick={() => removeSecret(secret.id)}
                          className="p-2 text-sm text-muted-foreground hover:text-foreground"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => addSecret()}
                  className="mt-4 text-sm text-primary hover:text-primary/80"
                >
                  + Add custom secret
                </button>
              </div>
            </div>
          </div>
          <div className="border rounded-lg p-6">
            <h2 className="font-medium mb-4">Voice model</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Optional</span>
              <Input type="text" className="w-full px-3 py-1 rounded border bg-background text-foreground" placeholder="ckt-beta-medium" defaultValue="ckt-beta-medium" />
            </div>
          </div>
          <Link to="/agent/new/review">
            <button className="text-medium w-full py-2 bg-yellow-300 hover:bg-yellow-400 rounded-lg text-black mt-6">Review character</button>
          </Link>
        </div>
      </div>
    </div>
  );
}