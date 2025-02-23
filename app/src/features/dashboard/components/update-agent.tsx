import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    //CardDescription,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useAgentDeployStore, AgentConfig } from '@/stores/agentDeployStore';
import { useAgentDeployment } from '@/hooks/use-agent-deployment';
import { useAuthStore } from '@/stores/authStore';
import { useAgentActiveStore } from '@/stores/agentActive';
import { IconTrash } from '@tabler/icons-react';
import { toast } from '@/hooks/use-toast'
import { ToastAction } from "@/components/ui/toast"
import Jazzicon from 'react-jazzicon'
import { stringToUniqueNumber } from '@/lib/utils'

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

export function UpdateAgent() {
    const [deploying, setDeploying] = useState(false)
    const [theme, setTheme] = useState(localStorage.getItem('vite-ui-theme'));
    const { setRefresh, getAgent, setAgent, clearAgent, getConfig, setConfig } = useAgentActiveStore((state) => state)
    const { getUser } = useAuthStore((state) => state)
    const { getEnv, getProvisioning, setProvisioning } = useAgentDeployStore((state) => state)
    const setIsProvisioning = (status: boolean) => setProvisioning({ ...getProvisioning(), completed: false, isProvisioning: status })
    let characterConfig = getConfig();
    let characterEnvVars = getEnv();
    const agentId = getAgent()?.id;
    const isNewAgent = !agentId;

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
        title: "🤖 Updating agent, please wait...",
        description: "Agent will be updated in a few seconds.",
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
            composePath: '',
            agentAlias: ''
          },
          envVars: characterEnvVars
        };

        updateAgent(agentData);
        clearAgent()
        setRefresh(new Date().getTime())
        setAgent(getAgent()!);

        setIsProvisioning(true);


      } catch (error) {
        console.error('Failed to update agent:', error);
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
    }, [deploying])

    return (
      <div className="min-h-screen w-full bg-background text-foreground">
        <div>
            <Card className='mb-6'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 p-4 pb-2'>
                  <CardTitle className='text-2xl font-bold'>
                    Update Avatar
                  </CardTitle>
                </CardHeader>
                <CardContent className='pt-1 px-4 pb-4'>
                {getAgent() && getAgent()?.logo ? (
                <Avatar className='h-24 w-24 mb-3'>
                    <AvatarImage src={getAgent()?.logo as string} alt='@agent' />
                    <AvatarFallback>AGENT</AvatarFallback>
                </Avatar>
                ) : (
                <Avatar className='h-24 w-24 mb-3'>
                    <Jazzicon diameter={128} seed={stringToUniqueNumber(`${getAgent()?.name}:${getAgent()?.id}`)} />
                </Avatar>
                )}
                
                <Button variant='ghost'><IconTrash className='h-8 w-8' /> Reset</Button>
                </CardContent>
                
              </Card>
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
              Error updating agent: {updateError.message}
            </p>
          )}
          <button
            onClick={handleDeploy}
            disabled={true}
            className="text-medium w-full py-2 bg-yellow-300 hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-black mt-6"
          >
            {isUpdating || deploying ? 'Updating...' : 'Update agent'}
          </button>
        </div>
      </div>
    );

}