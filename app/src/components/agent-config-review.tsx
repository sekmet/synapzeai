import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { Moon, Sun } from "lucide-react";
import { basicSetup } from "@codemirror/basic-setup";
import { oneDark } from "@codemirror/theme-one-dark";

const sampleJson = {
  modelProvider: "anthropic",
  settings: {
    secrets: [{
      OPENAI_API_KEY: "123",
      TWITTER_USERNAME: "123",
      TWITTER_PASSWORD: "123",
      TWITTER_EMAIL: "456",
      POST_IMMEDIATELY: "true",
      ZERG0_INDEXER_RPC: "456",
      ZERG0_EVM_RPC: "456",
      ZERG0_PRIVATE_KEY: "456",
      ZERG0_FLOW_ADDRESS: "456"
    }],
    voice: {
      model: "en_GB-danny-low"
    },
    plugins: [],
    bio: []
  }
};
export default function AgentConfigReview() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };

  return <div className="min-h-screen w-full bg-background text-foreground">
      <div className="container mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Confirm agent details</h1>
          <button onClick={toggleTheme} className="p-2 rounded-md hover:bg-muted">
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
        <p className="text-muted-foreground mb-8">
          You will be deploying an agent with the information below. This is the
          final step before your agent is deployed.
        </p>
        <div className="border rounded-lg overflow-hidden">
          <CodeMirror value={JSON.stringify(sampleJson, null, 2)} height="400px" extensions={[json(), basicSetup]} theme={isDark ? oneDark : undefined} className="text-sm" />
        </div>
      </div>
    </div>;
}