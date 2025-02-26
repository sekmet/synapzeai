import { useState, useEffect } from "react";
import { useRouter, useCanGoBack } from '@tanstack/react-router'
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { EditorView } from "@codemirror/view";
/*import { 
    syntaxHighlighting,
    defaultHighlightStyle
} from "@codemirror/language"*/
import { 
    xcodeLightStyle, 
    xcodeLightInit,
    xcodeDarkStyle, 
    xcodeDarkInit 
} from '@uiw/codemirror-theme-xcode';
import { ChevronLeft } from "lucide-react";
import { useAgentDeployStore, AgentConfig } from '@/stores/agentDeployStore';
import { useAgentDeployment } from '@/hooks/use-agent-deployment';
import { useAuthStore } from '@/stores/authStore';
import { useAgentActiveStore } from '@/stores/agentActive';
import { toast } from '@/hooks/use-toast'
import { ToastAction } from "@/components/ui/toast"


export default function AgentConfigReview() {
    const router = useRouter()
    const canGoBack = useCanGoBack()
    const [theme, setTheme] = useState(localStorage.getItem('vite-ui-theme'));
    const [deploying, setDeploying] = useState(false)
    const { setRefresh, getAgent, setAgent, clearAgent } = useAgentActiveStore((state) => state)
    const { getUser } = useAuthStore((state) => state)
    const { getConfig, setConfig, getEnv, getPluginSecrets, getProvisioning, setProvisioning } = useAgentDeployStore((state) => state)
    const setIsProvisioning = (status: boolean) => setProvisioning({ ...getProvisioning(), completed: false, isProvisioning: status })
    
    let characterConfig = getConfig();
    let characterEnvVars = null;
    let characterSecrets = null;

    const agentId = '';
    const isNewAgent = !agentId;

    // process env vars to extract alls keys
    const keysToExtract: any = {};
    const envSections = getEnv();
    // Properly iterate through the nested structure
    for (const sectionKey in envSections) {
      const section = envSections[sectionKey as keyof typeof envSections];
      if (typeof section === 'object' && section !== null) {
        Object.entries(section).forEach(envPair => {
          Object.assign(keysToExtract, { [envPair[0]]: envPair[1] });
        });
      }
    }
    characterEnvVars = keysToExtract;
  
    // process plugins secrets to extract alls secrets
    const secretsToExtract: any = {};
    const pluginsSecrets = getPluginSecrets();
    // Properly iterate through the nested structure
    for (const sectionPlugin in pluginsSecrets) {
      const plugin = pluginsSecrets[sectionPlugin as keyof typeof pluginsSecrets];
      if (typeof plugin === 'object' && plugin !== null) {
        Object.entries(plugin).forEach(envPair => {
          Object.assign(secretsToExtract, { [envPair[0]]: envPair[1] });
        });
      }
    }
    characterSecrets = secretsToExtract;

    
    const {
      updateAgent,
      isUpdating,
      updateError
    } = useAgentDeployment(agentId || '');

    const updateAgentConfig = async (newCharacterConfig: AgentConfig) => {
      if (!newCharacterConfig) {
        console.error('No agent configuration found');
        return;
      }
      setConfig(newCharacterConfig);
      characterConfig = getConfig();
    }


    const handleDeploy = async () => {
      if (!characterConfig) {
        console.error('No agent configuration found');
        return;
      }

      setDeploying(true);
      toast({
        title: "🤖 Deploying agent, please wait...",
        description: "Agent will be deployed in a few seconds.",
        action: (
          <ToastAction altText="Close">Close</ToastAction>
        ),
      })

      try {
        const currentUserId = getUser()?.id; //window.localStorage.getItem('userId'); // Assuming you store userId in localStorage after login
        // Fetch current user's organization
        const response = await fetch(`${import.meta.env.VITE_API_DB_HOST_URL}/v1/organizations/${currentUserId}/organization`,{
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_JWT_DB_API}`,
            'Content-Type': 'application/json',
          }
        });
        const organization = await response.json();
        
        //const userOrg = organizations?.length > 0 && organizations.find((org: any) => 
        //  org.members?.some((member: any) => member.user_id === currentUserId)
        //);

        if (!organization[0]) {
          console.error('No organization found for current user');
          return;
        }

        const agentData = {
          //...(agentId && { id: agentId }), // Only include id if it exists
          name: characterConfig.name,
          configuration: characterConfig,
          userId: getUser()?.id,
          organizationId: organization[0],
          containerId: '',
          status: 'active',
          metadata: {
            lastDeployedAt: new Date().toISOString(),
            isNewAgent,
            composePath: '',
            agentAlias: ''
          },
          envVars: characterEnvVars,
          secrets: characterSecrets
        };

        updateAgent(agentData);
        clearAgent()
        setRefresh(new Date().getTime())
        setAgent(getAgent()!);
        setIsProvisioning(true);
        if (!deploying) {
          router.navigate({ to: '/' });
        }
      } catch (error) {
        console.error('Failed to deploy agent:', error);
        setDeploying(false);
        setIsProvisioning(false);
      }
    };

    const currentTheme = theme === 'dark' 
    ? {
        style: xcodeDarkStyle, 
        init: xcodeDarkInit
    }
    : { 
        style: xcodeLightStyle, 
        init: xcodeLightInit
    }

    useEffect(() => {
        setTheme(localStorage.getItem('vite-ui-theme'));
        console.log(characterEnvVars)
        console.log(characterSecrets)
    }, [deploying])

    return (
      <div className="min-h-screen w-full bg-background text-foreground">
        <div className="container mx-auto p-8">
          {canGoBack ? (
            <button 
              onClick={() => router.history.back()} 
              className="flex items-center text-yellow-500 dark:text-yellow-400 mb-6 hover:opacity-80"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Settings
            </button>
          ): null}           
          <div className="flex items-center justify-between mb-8">         
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Confirm agent details
            </h1>
          </div>
          <p className="text-gray-900 dark:text-white mb-8">
            You will be deploying an agent with the information below. This is the
            final step before your agent is deployed.
          </p>
          <div className="border rounded-lg overflow-hidden">
          <CodeMirror
              className="border rounded-md overflow-hidden text-medium"
              value={JSON.stringify(characterConfig, null, 2)}
              extensions={[
                json(), 
                EditorView.lineWrapping
              ]}
              onChange={(value) => { 
                updateAgentConfig(JSON.parse(value) as unknown as AgentConfig)
              }}
              theme={currentTheme.init({
                settings: {
                  fontFamily: 'Inter',
                  fontSize: '16px',
                  ...currentTheme.style
                }
              })}
              basicSetup={{
                lineNumbers: true,
                foldGutter: false,
                highlightActiveLine: true,
              }}
            />
          </div>
          {updateError && (
            <p className="text-red-500 mt-4">
              Error deploying agent: {updateError.message}
            </p>
          )}
          <button
            onClick={handleDeploy}
            disabled={isUpdating || deploying}
            className="text-medium w-full py-2 bg-yellow-300 hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-black mt-6"
          >
            {isUpdating || deploying ? 'Deploying...' : 'Deploy agent'}
          </button>
        </div>
      </div>
    );
}