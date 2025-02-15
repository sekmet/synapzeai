import { useState, useEffect } from "react";
import { useRouter, useCanGoBack } from '@tanstack/react-router'
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { ChevronLeft } from "lucide-react";
import { useAgentDeployStore } from '@/stores/agentDeployStore';
import { useAgentDeployment } from '@/hooks/useAgentDeployment';
import { useAuthStore } from '@/stores/authStore';
import { useAgentActiveStore } from '@/stores/agentActive';
import { toast } from '@/hooks/use-toast'
import { ToastAction } from "@/components/ui/toast"
//import { Moon, Sun } from "lucide-react";
//import { basicSetup } from "@codemirror/basic-setup";
//import { oneDark } from "@codemirror/theme-one-dark";
//import { Editor } from "./editor";
export default function AgentConfigReview() {
    const router = useRouter()
    const canGoBack = useCanGoBack()
    const [deploying, setDeploying] = useState(false)
    const { setRefresh, setAgent } = useAgentActiveStore((state) => state)
    const { setOnboarding, getOnboarding, getUser } = useAuthStore((state) => state)
    const agentDeploy = useAgentDeployStore.getState();
    const characterConfig = agentDeploy.getConfig();
    const characterEnvVars = agentDeploy.getEnv();
    const agentId = '';
    const isNewAgent = !agentId;

    const {
      updateAgent,
      isUpdating,
      updateError
    } = useAgentDeployment(agentId || '');

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
          organizationId: organization[0],
          containerId: '',
          status: 'active',
          metadata: {
            lastDeployedAt: new Date().toISOString(),
            isNewAgent,
          },
          envVars: characterEnvVars
        };

        updateAgent(agentData);
        
        // Mark onboarding as completed
        setOnboarding({ ...getOnboarding(), completed: true })
        setRefresh(new Date().getTime())
        // Navigate to success page or dashboard
        router.navigate({ to: '/' });
      } catch (error) {
        console.error('Failed to deploy agent:', error);
        setDeploying(false);
      }
    };

    useEffect(() => {

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
              ref={(ref) => {
                if (ref) console.log(ref);
              }}
              className="border rounded-md overflow-hidden text-medium"
              value={JSON.stringify(characterConfig, null, 2)}
              extensions={[json()]}
              onChange={() => {}}
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