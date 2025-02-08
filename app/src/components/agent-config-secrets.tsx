import { Link } from '@tanstack/react-router'
import { useRouter, useCanGoBack } from '@tanstack/react-router'
import { useState } from "react";
import { ChevronLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button"

interface AdditionalSecret {
  id: number;
  key: string;
  value: string;
}

export default function AgentConfigSecrets() {
    const router = useRouter()
    const canGoBack = useCanGoBack()
  const [additionalSecrets, setAdditionalSecrets] = useState<AdditionalSecret[]>([{
    id: 1,
    key: "",
    value: ""
  }, {
    id: 2,
    key: "",
    value: ""
  }, {
    id: 3,
    key: "",
    value: ""
  }]);
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

  return (
  <div className="min-h-screen bg-background text-foreground w-full p-8">
      <div className="max-w-full sm:max-w-5xl mx-auto">
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
              {["OPENAI_API_KEY", "TWITTER_USERNAME", "TWITTER_PASSWORD", "TWITTER_EMAIL", "POST_IMMEDIATELY", "TELEGRAM_BOT_TOKEN", "FAKECASTER_NETWORK_API_KEY", "FAKECASTER_PID", "FAKECASTER_NETWORK_SIGNER_UUID", "EVN_PRIVATE_KEY", "LENS_PROFILE_ID", "ZEPRO_INDEXER_RPC", "ZEPRO_EVM_RPC", "ZEPRO_PRIVATE_KEY", "ZEPRO_FLOW_ADDRESS", "ABSTRACT_ADDRESS", "ABSTRACT_PRIVATE_KEY", "AKASH_ENV", "AKASH_NET", "RPC_ENDPOINT", "AKASH_GAS_PRICES", "AKASH_GAS_ADJUSTMENT", "AKASH_KEYRING_BACKEND", "AKASH_FROM", "AKASH_FEES", "AKASH_DSEQ", "AKASH_MANIFEST_MODE", "AKASH_MANIFEST_VALIDATION_LEVEL", "AKASH_MANIFEST_PATH", "AKASH_DEPOSIT", "AKASH_CFG", "ALLURA_API_KEY", "ARTERRA_PRIVATE_KEY", "AUTONAME_JWT_TOKEN", "AUTONAME_RPC"].map(label => <div key={label} className="grid grid-cols-2 gap-4">
                  <div className="text-sm font-medium">{label}</div>
                  <input type="text" className="w-full px-3 py-1 rounded border bg-background text-foreground" placeholder="Enter value..." />
                </div>)}
            </div>
          </div>
          <div className="border rounded-lg p-6">
            <h2 className="font-medium mb-4">Additional secrets</h2>
            <p className="text-sm text-muted-foreground mb-6">
              In case you need to add secrets that are not listed above.
            </p>
            <div className="space-y-4">
              {additionalSecrets.map(secret => <div key={secret.id} className="grid grid-cols-2 gap-4">
                  <input type="text" className="w-full px-3 py-1 rounded border bg-background text-foreground" placeholder="Enter key..." value={secret.key} onChange={e => updateSecret(secret.id, "key", e.target.value)} />
                  <div className="flex gap-2">
                    <input type="text" className="w-full px-3 py-1 rounded border bg-background text-foreground" placeholder="Enter value..." value={secret.value} onChange={e => updateSecret(secret.id, "value", e.target.value)} />
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
              <input type="text" className="w-full px-3 py-1 rounded border bg-background text-foreground" placeholder="ckt-beta-medium" value="ckt-beta-medium" />
            </div>
          </div>
          <Link to="/agent/new/review">
            <Button className="text-medium w-full py-2 bg-yellow-300 hover:bg-yellow-400 rounded-lg text-black mt-6">Review character</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}