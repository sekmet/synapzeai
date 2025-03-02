import { v4 as uuidv4 } from 'uuid';
import { AgentEnvironmentVars } from '@/types/agent-enviroment-v1';
import { useAgentDeployStore } from '@/stores/agentDeployStore';
import { useAgentActiveStore, Agent } from '@/stores/agentActive';
import { useAuthStore } from '@/stores/authStore';
import { useAgentStore } from '@/stores/agentStore';

// Agent API functions
interface AgentData {
  id?: string;
  userId?: string;
  organizationId?: string;
  containerId?: string;
  name?: string;
  description?: string;
  status?: string;
  version?: string;
  configuration?: any;
  metadata?: any;
  envVars?: AgentEnvironmentVars | null;
}

interface Port {
  IP?: string;
  PrivatePort: number;
  PublicPort?: number;
  Type: string;
}

interface Container {
  Id: string;
  Names: string[];
  Ports: Port[];
}

interface ContainersListing {
  containers: Container[];
}

interface OutputClientSQlite {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Cleans up and parses a JSON string representing an array of objects.
 *
 * @param outputString - The JSON string to clean and parse.
 * @returns An array of OutputClientSQlite objects, or an empty array if parsing fails.
 */
export function parseOutputSQlite(output:string): OutputClientSQlite[] {
  // Trim any extraneous whitespace and newline characters.
  const cleanedOutput = output.trim();

  try {
    // Parse the cleaned JSON string.
    const parsed = JSON.parse(cleanedOutput);

    // Ensure the result is an array.
    if (!Array.isArray(parsed)) {
      throw new Error('Parsed output is not an array.');
    }

    return parsed as OutputClientSQlite[];
  } catch (error) {
    console.error('Error parsing output string:', error);
    return [];
  }
}


export const fetchUserAgents = async (userId: string) => {
  if (!userId) return [];
  const agentStore = useAgentStore.getState();
  //console.log('fetchUserAgents ', userId)
  const userOrg = await fetch(`${import.meta.env.VITE_API_DB_HOST_URL}/v1/organizations/${userId}/organization`,{
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_JWT_DB_API}`,
      'Content-Type': 'application/json',
    }
  });
  const org = await userOrg.json();

  const response = await fetch(`${import.meta.env.VITE_API_DB_HOST_URL}/v1/agents/${org[0]}`,{
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_JWT_DB_API}`,
      'Content-Type': 'application/json',
    }
  });
  const result = await response.json();
  // Set agents in the agent store.
  agentStore.setAgents( result as Agent[]);
  return result;
};


export const fetchUserAgent = async (userId: string, agentId: string) => {
  if (!userId || !agentId) return null;
  console.log('fetchUserAgent ', userId, agentId)
  const userOrg = await fetch(`${import.meta.env.VITE_API_DB_HOST_URL}/v1/organizations/${userId}/organization`,{
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_JWT_DB_API}`,
      'Content-Type': 'application/json',
    }
  });
  const org = await userOrg.json();

  if (!org[0]) return null;

  const response = await fetch(`${import.meta.env.VITE_API_DB_HOST_URL}/v1/agent/${agentId}`,{
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_JWT_DB_API}`,
      'Content-Type': 'application/json',
    }
  });
  return response.json();
};

/**
 * Extracts the largest PublicPort number from a containers listing.
 *
 * @param containersListing - An object containing an array of container definitions.
 * @returns The largest PublicPort number found, or null if none is available.
 */
export function extractBiggestPublicPort(containersListing: ContainersListing): number | null {
  let maxPublicPort: number | null = null;

  for (const container of containersListing.containers) {
    for (const port of container.Ports) {
      // Only consider ports that have a PublicPort defined.
      if (port.PublicPort !== undefined) {
        if (maxPublicPort === null || port.PublicPort > maxPublicPort) {
          maxPublicPort = port.PublicPort;
        }
      }
    }
  }

  return maxPublicPort;
}

export const sleep = async (ms: number) => {
  await new Promise((resolve) => setTimeout(resolve, ms));
};


export const getAgentContainerMetadata = async (composePath: string) => {

    // Extract the directory from the composePath.
    const _composePath = composePath.split('/');
    _composePath.pop();
    const dirPath = _composePath.join('/');
    const agentAlias = dirPath.split('/').pop();

    return {
      composePath: dirPath,
      agentAlias
    }
}

/**
 * Extracts the container name from an array of output strings.
 * The function looks for a line containing "Container" and returns
 * the container name (assumed to be the first non-space token after "Container").
 *
 * @param outputLines - An array of strings from the docker output.
 * @returns The container name if found, otherwise null.
 */
export function extractContainerName(outputLines: string[]): string | null {
  // Iterate through each line in the output.
  for (const line of outputLines) {
    // Check if the line contains "Container".
    if (line.includes("Container")) {
      // Use a regex to capture the container name.
      // The regex looks for "Container" followed by one or more spaces, then captures
      // the following non-space sequence (i.e. the container name).
      const match = line.match(/Container\s+([^\s]+)/);
      if (match && match[1]) {
        return match[1];
      }
    }
  }
  return null;
}


export const getContainerInfoByName = async (name: string) => {
  if (!name) return null;
  
  const response = await fetch(`${import.meta.env.VITE_API_HOST_URL}/v1/containers?all=true&limit=1&filters={"status": ["running"],"name":["${name}"]}`,{
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_JWT_AGENT_API}`,
      'Content-Type': 'application/json',
    }
  });
  
  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    const error = await response.text();
    throw new Error(`Failed to fetch agent: ${error}`);
  }

  return response.json();
};

export const getContainerListing = async () => {
  
  const response = await fetch(`${import.meta.env.VITE_API_HOST_URL}/v1/containers?all=true&limit=300&filters={"status": ["running"],"label":["com.docker.compose.service=eliza"]}`,{
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_JWT_AGENT_API}`,
      'Content-Type': 'application/json',
    }
  });
  
  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    const error = await response.text();
    throw new Error(`Failed to fetch agent: ${error}`);
  }

  return response.json();
};



export const getAgentById = async (id: string) => {
  if (!id) return null;
  
  const response = await fetch(`${import.meta.env.VITE_API_DB_HOST_URL}/v1/agent/${id}`,{
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_JWT_DB_API}`,
      'Content-Type': 'application/json',
    }
  });
  
  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    const error = await response.text();
    throw new Error(`Failed to fetch agent: ${error}`);
  }

  return response.json();
};

export const createAgent = async (agentData: AgentData) => {
  const response = await fetch(`${import.meta.env.VITE_API_DB_HOST_URL}/v1/agents`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_JWT_DB_API}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      organizationId: agentData.organizationId || uuidv4(), // You might want to get this from your auth context
      name: agentData.name,
      description: agentData.description || "",
      status: agentData.status || "draft",
      version: agentData.version || "0.0.1",
      configuration: agentData.configuration,
      metadata: agentData.metadata || {}
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create agent: ${error}`);
  }

  return response.json();
};


export const createAgentEnvVariables = async (agentId: string, agentEnvVars: AgentEnvironmentVars) => {
  const variables = { 
    ...agentEnvVars
  }
  const response = await fetch(`${import.meta.env.VITE_API_DB_HOST_URL}/v1/agents/${agentId}/env-variables`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_JWT_DB_API}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({variables}),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create agent env variables: ${error}`);
  }

  return response.json();
};


export const getAgentEnvVariables = async (id: string) => {
  if (!id) return null;
  
  const response = await fetch(`${import.meta.env.VITE_API_DB_HOST_URL}/v1/agents/${id}/env-variables`,{
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_JWT_DB_API}`,
      'Content-Type': 'application/json',
    }
  });
  
  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    const error = await response.text();
    throw new Error(`Failed to fetch agent: ${error}`);
  }

  return response.json();
};


export const generateAgentDockerComposeFile = async (
  agentId: string, 
  envVars: Record<string, string>, 
  dockerImageName?: string, 
  agentServerPort?: string,
  agentJwtSecret?: string,
  agentHostDomain?: string
) => {

  const agentEnvVars = []
  for (const [key, value] of Object.entries(envVars)) {
    agentEnvVars.push(`${key}=${value}`)
  }

  const composeVars = {
    agentId,
    dockerImageName: dockerImageName ?? "synapze/elizav019d",
    envVars: agentEnvVars,
    agentServerPort: agentServerPort ?? "3001",
    agentJwtSecret: agentJwtSecret ?? `${import.meta.env.VITE_JWT_AGENT_SECRET}`,
    agentHostDomain: agentHostDomain ?? "synapze.xyz"
  }

  const response = await fetch(`${import.meta.env.VITE_API_HOST_URL}/v1/docker/${agentId}/write-compose-file`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_JWT_AGENT_API}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(composeVars),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to generate agent docker compose file: ${error}`);
  }

  return response.json();
};

export const deployAgentDefaultCharacterJsonFile = async (agentId: string, composePath: string, characterJson: string) => {
  const response = await fetch(`${import.meta.env.VITE_API_HOST_URL}/v1/docker/${agentId}/write-default-character-json`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_JWT_AGENT_API}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      composePath,
      characterJson
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to deploy agent docker compose file: ${error}`);
  }

  return response.json();
};

export const executeCommandOnAgentContainer = async (containerId: string, Cmd: string[], AttachStdout: boolean, AttachStderr: boolean, Env?: string[]) => {

  if (!containerId || containerId === 'undefined') {
    console.error('Container ID is required');
    return null
  }

  const response = await fetch(`${import.meta.env.VITE_API_HOST_URL}/v1/containers/${containerId}/exec`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_JWT_AGENT_API}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
        execOptions: {
          Cmd,
          AttachStdout,
          AttachStderr,
          Env
      }
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to execute the command on the agent container: ${error}`);
  }

  return response.json();
};

export const getDeployedAgentClientId = async (containerId: string, agentName: string) => {

  if (!containerId || containerId === 'undefined') {
    console.error('Container ID is required');
    return null
  }

  const Cmd = ["/root/.local/bin/sqlite-utils", "/app/agent/data/db.sqlite", "select id from accounts where name = '" + agentName + "'"];
  const AttachStdout =  true; 
  const AttachStderr = true;

  const response = await executeCommandOnAgentContainer(containerId, Cmd, AttachStdout, AttachStderr);

  if (!response || !response.output) {
    throw new Error(`Failed to execute the command on the agent container: ${Cmd}`);
  }
  
  console.log('CLIENT RESPONSE', response.output);

  const parsedOutput = parseOutputSQlite(response.output);
  console.log('CLIENT RESPONSE Parsed', parsedOutput[0]);
  const agentClientId = parsedOutput[0].id;

  return agentClientId;
}


export const installElizav1Plugin = async (
  agentId: string,
  pluginPackageName: string, 
  pluginSecrets?: Record<string, string>
) => {

  if (!agentId || agentId === 'undefined') {
    console.error('Agent ID is required');
    return null
  }

  // Get the agent information by id using getAgentById = async (id: string)
  const agent = await getAgentById(agentId);

  if (!agent) {
    console.error('Agent not found');
    return null;
  }

  const containerId = `${agent.container_id}`.split(':')[0];
  const metadata = agent.metadata ? JSON.parse(agent.metadata) : {};
  const composePath = `${metadata.composePath}/default.character.json`;

  if (!containerId) {
    console.error('Container ID not found');
    return null;
  }

  if (!composePath) {
    console.error('Compose path not found in agent metadata');
    return null;
  }

  // Install the plugin using elizaos
  const Cmd = ["npx", "elizaos", "plugins", "add", `@elizaos-plugins/${pluginPackageName}`];  
  const AttachStdout = true; 
  const AttachStderr = true;

  const response = await executeCommandOnAgentContainer(containerId, Cmd, AttachStdout, AttachStderr);

  if (!response || !response.output) {
    throw new Error(`Failed to execute the command on the agent container: ${Cmd}`);
  }
  
  console.log('CLIENT RESPONSE', response.output);

  if (response.output) {
    // Parse the plugin package name to find if it's a plugin-* or a client-* plugin type
    // Example client: @elizaos-plugins/client-discord
    // Example plugin: @elizaos-plugins/plugin-coinmarketcap
    const isClient = pluginPackageName.includes('client-');
    const isPlugin = pluginPackageName.includes('plugin-');
    
    // Extract the plugin/client name without the prefix
    const packageNameParts = pluginPackageName.split('/');
    const nameWithPrefix = packageNameParts[packageNameParts.length - 1];
    const name = isClient ? nameWithPrefix.replace('client-', '') : 
                isPlugin ? nameWithPrefix.replace('plugin-', '') : nameWithPrefix;

    // Read and load the default character json from agent composePath
    const characterJsonResponse = await fetch(`${import.meta.env.VITE_API_HOST_URL}/v1/docker/${agentId}/read-default-character-json?composePath=${encodeURIComponent(composePath)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_JWT_AGENT_API}`,
        'Content-Type': 'application/json',
      }
    });

    if (!characterJsonResponse.ok) {
      console.error('Failed to read default character JSON');
      return false;
    }

    const { characterJson } = await characterJsonResponse.json();

    if (!characterJson) {
      console.error('Default character JSON not found');
      return false;
    }

    // Update the "plugins" or "clients" array based on the plugin package name type
    if (isClient) {
      // Add to clients array if it doesn't exist
      if (!characterJson.clients) {
        characterJson.clients = [];
      }
      if (!characterJson.clients.includes(name)) {
        characterJson.clients.push(name);
      }
      // Add to plugins array if it doesn't exist
      if (!characterJson.plugins) {
        characterJson.plugins = [];
      }
      if (!characterJson.plugins.includes(name)) {
        characterJson.plugins.push(name);
      }
    } else if (isPlugin) {
      // Add to plugins array if it doesn't exist
      if (!characterJson.plugins) {
        characterJson.plugins = [];
      }
      if (!characterJson.plugins.includes(name)) {
        characterJson.plugins.push(name);
      }
    }

    // Update the secrets section of the default character json
    if (pluginSecrets && Object.keys(pluginSecrets).length > 0) {
      if (!characterJson.settings) {
        characterJson.settings = {};
      }
      if (!characterJson.settings.secrets) {
        characterJson.settings.secrets = {};
      }
      
      // Add the plugin secrets to the settings.secrets object
      Object.keys(pluginSecrets).forEach(key => {
        characterJson.settings.secrets[key] = pluginSecrets[key];
      });
    }

    // Write the updated default character json back to the agent composePath
    const writeResponse = await fetch(`${import.meta.env.VITE_API_HOST_URL}/v1/docker/${agentId}/write-default-character-json`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_JWT_AGENT_API}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        composePath,
        characterJson
      })
    });

    if (!writeResponse.ok) {
      console.error('Failed to write updated default character JSON');
      return false;
    }

    // Restart the agent container
    const restartResponse = await fetch(`${import.meta.env.VITE_API_HOST_URL}/v1/containers/${containerId}/copy-file`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_JWT_AGENT_API}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        containerId,
        srcPath: `${composePath}`,
        destPath: '/app/characters/default.character.json'
      })
    });

    if (!restartResponse.ok) {
      console.error('Failed to restart agent container');
      return false;
    }

    return true;
  }

  return false;
}


export const updateAgentContainerWithDefaultCharacterJson = async (containerId: string, srcPath: string, destPath: string) => {
  const response = await fetch(`${import.meta.env.VITE_API_HOST_URL}/v1/containers/${containerId}/copy-file`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_JWT_AGENT_API}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      containerId,
      srcPath,
      destPath
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to deploy agent docker compose file: ${error}`);
  }

  return response.json();
};


export const deployAgentDockerComposeFile = async (agentId: string, composePath: string) => {
  const response = await fetch(`${import.meta.env.VITE_API_HOST_URL}/v1/docker/${agentId}/deploy-compose`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_JWT_AGENT_API}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({composePath}),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to deploy agent docker compose file: ${error}`);
  }

  return response.json();
};


export const downAgentDockerCompose = async (agentId: string, composePath: string) => {
  const response = await fetch(`${import.meta.env.VITE_API_HOST_URL}/v1/docker/${agentId}/down-compose`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_JWT_AGENT_API}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({composePath}),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to deploy agent docker compose file: ${error}`);
  }

  return response.json();
};

export const removeAgentDockerCompose = async (agentId: string, composePath: string) => {
  const response = await fetch(`${import.meta.env.VITE_API_HOST_URL}/v1/docker/${agentId}/remove-compose`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_JWT_AGENT_API}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({composePath}),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to deploy agent docker compose file: ${error}`);
  }

  return response.json();
};


export const updateAgentContainerId = async (agentId: string, containerId: string) => {
  const response = await fetch(`${import.meta.env.VITE_API_DB_HOST_URL}/v1/agents/${agentId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_JWT_DB_API}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      container_id: containerId
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to update agent container id: ${error}`);
  }

  return response.json();
};

export const createAgentSubdomain = async (composePath: string) => {
  const response = await fetch(`${import.meta.env.VITE_API_HOST_URL}/v1/agent/create-subdomain`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_JWT_AGENT_API}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({composePath}),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create agent subdomain: ${error}`);
  }

  return response.json();
};


export const removeAgentSubdomain = async (composePath: string) => {
  const response = await fetch(`${import.meta.env.VITE_API_HOST_URL}/v1/agent/remove-subdomain`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_JWT_AGENT_API}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({composePath}),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to remove agent subdomain: ${error}`);
  }

  return response.json();
};


export const updateAgentContainerMetadata = async (agentId: string, metadata: Record<string, string>) => {
  const response = await fetch(`${import.meta.env.VITE_API_DB_HOST_URL}/v1/agents/${agentId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_JWT_DB_API}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      metadata
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to update agent metadata: ${error}`);
  }

  return response.json();
};

export const deleteAgentDeployment = async (agentId: string, composePath: string): Promise<boolean> => {

  if (!agentId || !composePath) {
    throw new Error("Missing required parameters");
  }

  const responseDown = await fetch(`${import.meta.env.VITE_API_HOST_URL}/v1/docker/${agentId}/down-compose`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_JWT_AGENT_API}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({composePath}),
  });

  await responseDown.json();

  if (!responseDown.ok) {
    const error = await responseDown.text();
    throw new Error(`Failed to deploy agent docker compose file: ${error}`);
  } else {

    const response = await fetch(`${import.meta.env.VITE_API_HOST_URL}/v1/docker/${agentId}/remove-compose`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_JWT_AGENT_API}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({composePath}),
    });
  
    await response.json();

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to deploy agent docker compose file: ${error}`);
    }
  
    return true
  }
}

async function retryGetAgentClientId(containerId: string, agentName: string, maxRetries: number = 3): Promise<any> {
  let retryCount = 0;
  
  while (retryCount < maxRetries) {
    try {
      const agentClientId = await getDeployedAgentClientId(containerId, agentName);
      return agentClientId;
    } catch (error) {
      if (retryCount === maxRetries - 1) {
        throw new Error(`Failed to get agent client ID after ${maxRetries} attempts: ${error}`);
      }
      await new Promise(resolve => setTimeout(resolve, 10000)); // 10 sec delay
      retryCount++;
    }
  }
  
  throw new Error('Unexpected retry loop exit');
}

export const getSubscriptionAllowanceByCustomerId = async (id: string) => {
  if (!id) return null;
  
  const response = await fetch(`${import.meta.env.VITE_API_DB_HOST_URL}/v1/subscriptions/allowance/${id}`,{
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_JWT_DB_API}`,
      'Content-Type': 'application/json',
    }
  });
  
  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    const error = await response.text();
    throw new Error(`Failed to fetch agent: ${error}`);
  }

  return response.json();
};


export const updateAgentDeployment = async (agentData: AgentData) => {

  // check user subscription allowance number
  const subscriptionAllowance = await getSubscriptionAllowanceByCustomerId(agentData.userId ?? '');
  
  if (!subscriptionAllowance) {
    console.error('Subscription allowance not found');
    return null;
  }

  // check user agents deployed number
  const userAgentsDeployed = await fetchUserAgents(agentData.userId ?? '');
  if (Number(userAgentsDeployed.length) === Number(subscriptionAllowance.items)) {
    console.error('Maximum agent deployment reached');
    return null;
  }

  if (!agentData.id) {
    const agentProvisioning = useAgentDeployStore.getState();
    const userAuth = useAuthStore.getState();
    // If no ID is provided, create a new agent
    const newAgent = await createAgent(agentData);
    console.log({NEWAGENT: newAgent[0]});
    const agentId = newAgent[0];

    if (agentId && agentData.envVars) {
      
      agentProvisioning.setProvisioning({ ...agentProvisioning.getProvisioning(), isProvisioning: true, currentStep: 1 });

      // create agent env variables and store it in the database
      await createAgentEnvVariables(agentId, agentData.envVars);
      // get the agent env variables from the database
      const agentEnvVariables = await getAgentEnvVariables(agentId);
      console.log({agentEnvVariables});
      // get agent server port to use
      const containersListing = await getContainerListing();
      let agentServerPort = extractBiggestPublicPort(containersListing);
      if (agentServerPort && agentServerPort < 3000) {
        agentServerPort = 3000;
      }
      if (!agentServerPort) {
        agentServerPort = 3000;
      }
      console.log({Lastport: agentServerPort, Newport: Number(agentServerPort)+1});
      const newAgentServerPort = String(Number(agentServerPort)+1);

      // write the docker compose file for the agent
      const composeResult = await generateAgentDockerComposeFile(
        agentId, 
        agentEnvVariables,
        'synapze/elizav0258b', 
        newAgentServerPort ?? '3300',
        `${import.meta.env.VITE_JWT_AGENT_SECRET}`,
        'synapze.xyz'
      );

      agentProvisioning.setProvisioning({ ...agentProvisioning.getProvisioning(), currentStep: 2 });

      // write the default character json file for the agent
      const defaultCharacterJsonResult = await deployAgentDefaultCharacterJsonFile(agentId, composeResult.composePath, agentData.configuration);
      console.log({DEFAULTCHARACTERJSONRESULT: defaultCharacterJsonResult});

      // deploy the agent docker compose file
      const deployResult = await deployAgentDockerComposeFile(agentId, composeResult.composePath);
      console.log({DEPLOYRESULT: deployResult});

      agentProvisioning.setProvisioning({ ...agentProvisioning.getProvisioning(), currentStep: 3 })

      const containerName = extractContainerName(deployResult.output);
      if (!containerName) {
        console.log("Failed to create agent container");
        throw new Error("Failed to create agent container");
      }
      const containersInfo = await getContainerInfoByName(containerName);
      console.log({CONTAINERS: containersInfo});
      if (!containersInfo || containersInfo.length === 0) {
        console.log("Failed to get agent container information");
        throw new Error("Failed to get agent container information");
      }
      const container = containersInfo.containers[0];
      console.log({CONTAINER: container});
      const containerId = container.Id;
      console.log({CONTAINERID: containerId});

      agentProvisioning.setProvisioning({ ...agentProvisioning.getProvisioning(), currentStep: 4 });

      await updateAgentContainerWithDefaultCharacterJson(containerId, defaultCharacterJsonResult.characterFilePath, '/app/characters' );

      await sleep(30000);

      await updateAgentContainerId(agentId, `${containerId}:${newAgentServerPort ?? '3300'}`);

      await sleep(10000);

      agentProvisioning.setProvisioning({ ...agentProvisioning.getProvisioning(), currentStep: 5 });
      
      // update the agent data with the container id
      //agentData.containerId = `${containerId}:${newAgentServerPort ?? '3300'}`;
      
      // wait the container to be ready
      await sleep(21000);

      // get the agent client id
      const agentClientId = await retryGetAgentClientId(containerId, agentData.name as string, 5);

      agentProvisioning.setProvisioning({ ...agentProvisioning.getProvisioning(), currentStep: 6 });

      // create agent subdomain
      const { result } = await createAgentSubdomain(composeResult.composePath);
      const { agentAlias, agentSubdomain, agentServerIp } = result;

      // update the agent data with the container metadata
      const containerMetadata = await getAgentContainerMetadata(composeResult.composePath);
      agentData.metadata.composePath = containerMetadata.composePath;
      agentData.metadata.agentAlias = containerMetadata.agentAlias;
      agentData.metadata.agentClientId = agentClientId;
      agentData.metadata.agentHost = agentAlias;
      agentData.metadata.agentSubdomain = agentSubdomain;
      agentData.metadata.agentServerIp = agentServerIp;
      await updateAgentContainerMetadata(agentId, agentData.metadata);

      agentProvisioning.setProvisioning({ ...agentProvisioning.getProvisioning(), currentStep: 7 });

      console.log({AGENTDATA: agentData});
      const agents = await fetchUserAgents(userAuth.getUser()?.id ?? '')

      await sleep(1000);
      agentProvisioning.setProvisioning({ ...agentProvisioning.getProvisioning(), isProvisioning: false, completed: true });
      const agentActive = useAgentActiveStore.getState()
      if (agents[0]) {
          agentActive.setAgent(agents[0])
          agentActive.setRefresh(new Date().getTime());
          console.log('ACTIVE AGENT', agents[0])
      }
      
      return { agentId };
      
    } else {
      throw new Error("Failed to create agent env variables");
    }
  }

  // Update existing agent
  const response = await fetch(`${import.meta.env.VITE_API_DB_HOST_URL}/v1/agents/${agentData.id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_JWT_DB_API}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(agentData),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to update agent deployment: ${error}`);
  }

  return response.json();
};



export const deleteAgent = async (id: string) => {
  if (!id) return null;
  
  const response = await fetch(`${import.meta.env.VITE_API_DB_HOST_URL}/v1/agents/${id}`,{
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_JWT_DB_API}`,
      'Content-Type': 'application/json',
    }
  });
  
  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    const error = await response.text();
    throw new Error(`Failed to delete the agent: ${error}`);
  }

  return response.json();
};