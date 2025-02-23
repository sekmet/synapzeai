import { Link } from '@tanstack/react-router'
import { useRouter, useCanGoBack } from '@tanstack/react-router'
import { useState } from "react";
import { ChevronLeft, X } from "lucide-react";
import { getAgentEnvironmentFields } from '@/lib/templates';
import { useAgentDeployStore } from '@/stores/agentDeployStore';
import { Input } from "@/components/ui/input"
//import { Button } from "@/components/ui/button"

interface AdditionalSecret {
  id: number;
  key: string;
  value: string;
}

export default function AgentConfigSecrets() {
    const router = useRouter()
    const canGoBack = useCanGoBack()
    const { getConfig } = useAgentDeployStore((state) => state)

  const [additionalSecrets, setAdditionalSecrets] = useState<AdditionalSecret[]>([
    {
      id: 1,
      key: "",
      value: ""
    }
  ]);
  const addSecret = () => {
    const newId = Math.max(0, ...additionalSecrets.map(s => s.id)) + 1;
    setAdditionalSecrets([...additionalSecrets, {
      id: newId,
      key: "",
      value: ""
    }]);
  };
  const removeSecret = (id: number) => {
    setAdditionalSecrets(additionalSecrets.filter(secret => secret.id !== id));
  };
  const updateSecret = (id: number, field: "key" | "value", value: string) => {
    setAdditionalSecrets(additionalSecrets.map(secret => secret.id === id ? {
      ...secret,
      [field]: value
    } : secret));
  };

  // TODO: handle plugin config and secrets setups
  let characterConfig = getConfig();
  delete characterConfig?.pluginsConfig;
  delete characterConfig?.clientsConfig;


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
            <h2 className="font-medium mb-4">Add secrets</h2>
            <p className="text-sm text-muted-foreground mb-6">
              These are required to connect with your model, clients and
              plugins.
            </p>
            <div className="space-y-4">
              {getAgentEnvironmentFields().map((key) => {
                const agentDeploy = useAgentDeployStore.getState();
                const value =  agentDeploy.env && agentDeploy.env[key as keyof typeof agentDeploy.env] as string || '';
                return (
                  <div key={key} className="grid grid-cols-2 gap-4">
                    <div className="text-sm font-medium">{key}</div>
                    <Input
                      type="text"
                      className="w-full px-3 py-1 rounded border bg-background text-foreground"
                      placeholder="Enter value..."
                      defaultValue={value ?? ''}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        agentDeploy.updateEnv({ [key]: newValue });
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="border rounded-lg p-6">
            <h2 className="font-medium mb-4">Additional secrets</h2>
            <p className="text-sm text-muted-foreground mb-6">
              In case you need to add secrets that are not listed above.
            </p>
            <div className="space-y-4">
              {additionalSecrets.map(secret => <div key={secret.id} className="grid grid-cols-2 gap-4">
                  <Input type="text" disabled={secret.key !== ""} className="w-full px-3 py-1 rounded border bg-background text-foreground" placeholder="Enter key..." defaultValue={secret.key} onChange={e => updateSecret(secret.id, "key", e.target.value)} />
                  <div className="flex gap-2">
                    <Input type="text" className="w-full px-3 py-1 rounded border bg-background text-foreground" placeholder="Enter value..." defaultValue={secret.value} onChange={e => updateSecret(secret.id, "value", e.target.value)} />
                    <button onClick={() => removeSecret(secret.id)} className="p-2 text-sm text-muted-foreground hover:text-foreground">
                      <X size={16} />
                    </button>
                  </div>
                </div>)}
            </div>
            <button onClick={addSecret} className="mt-4 text-sm text-primary hover:text-primary/80">
              + Add secret
            </button>
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