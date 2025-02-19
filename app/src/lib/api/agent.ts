import { v4 as uuidv4 } from 'uuid';
import { AgentEnvironmentVars } from '@/stores/agentDeployStore';
import { addSubdomain, /*removeSubdomain,*/ type CloudflareCredentials } from './domains';

// Agent API functions
interface AgentData {
  id?: string;
  organizationId?: string;
  containerId?: string;
  name?: string;
  description?: string;
  status?: string;
  version?: string;
  configuration?: any;
  metadata?: any;
  envVars?: AgentEnvironmentVars;
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


export const fetchUserAgents = async (userId: string) => {
  if (!userId) return [];
  console.log('fetchUserAgents ', userId)
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

export const createAgentSubdomain = async (composePath: string) => {

  // Extract the directory from the composePath.
  const _composePath = composePath.split('/');
  _composePath.pop();
  const dirPath = _composePath.join('/');
  const agentAlias = `${dirPath.split('/').pop()}`.toLocaleLowerCase();
  const agentServerIp = `${import.meta.env.VITE_AGENT_SERVER_IP}`;
  const agentServerDomain = `${import.meta.env.VITE_AGENT_SERVER_DOMAIN}`;

  const credentials: CloudflareCredentials = {
    apiToken: `${import.meta.env.VITE_CLOUDFLARE_API_TOKEN}`,
    zoneId: `${import.meta.env.VITE_ZONE_ID}`,
  };

  console.log('Credentials:', credentials);
  try {
     //Adding a subdomain
    const addResult = await addSubdomain({
      ...credentials,
      subdomain: `${agentAlias}.${agentServerDomain}`,
      content: agentServerIp,
      type: 'A',
      proxied: false,
    });
    console.log('Subdomain added:', addResult);

     //Removing a subdomain
    //const removeResult = await removeSubdomain({
    //  ...credentials,
    //  subdomain: 'agent-klpvha.synapze.xyz',
    //});
    //console.log('Subdomain removed:', removeResult);
  } catch (error) {
    console.error(error);
  }

  return {
    agentAlias,
    agentSubdomain: `https://${agentAlias}.${agentServerDomain}`,
    agentServerIp
  }
}


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
    agentHostUrl: agentHostDomain ?? "synapze.xyz"
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
  const response = await fetch(`${import.meta.env.VITE_API_HOST_URL}/v1/containers/${containerId}/exec`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_JWT_AGENT_API}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Cmd,
      AttachStdout,
      AttachStderr,
      Env
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to execute the command on the agent container: ${error}`);
  }

  return response.json();
};

export const getDeployedAgentClientId = async (containerId: string, agentName: string) => {

  const Cmd = ["/root/.local/bin/sqlite-utils", "agent/data/db.sqlite", "select id from accounts where name = '" + agentName + "'"];
  const AttachStdout =  true; 
  const AttachStderr = true;

  const response = await executeCommandOnAgentContainer(containerId, Cmd, AttachStdout, AttachStderr);

  if (!response || !response.output) {
    throw new Error(`Failed to execute the command on the agent container: ${Cmd}`);
  }
  
  const parsedOutput = JSON.parse(response.output);
  const agentClientId = parsedOutput[0].id;

  return agentClientId;
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

  const responseDown = await fetch(`${import.meta.env.VITE_API_HOST_URL}/v1/docker/${agentId}/down-compose`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_JWT_AGENT_API}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({composePath}),
  });

  if (!responseDown.ok) {
    const error = await responseDown.text();
    throw new Error(`Failed to deploy agent docker compose file: ${error}`);
    return false;

  } else {

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

      return false
    }
  
    return true
  }
}

export const updateAgentDeployment = async (agentData: AgentData) => {
  if (!agentData.id) {
    // If no ID is provided, create a new agent
    const newAgent = await createAgent(agentData);
    console.log({NEWAGENT: newAgent[0]});
    const agentId = newAgent[0];

    if (agentId && agentData.envVars) {
      
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
        'synapze/elizav019d', 
        newAgentServerPort ?? '3300'
      );

      // write the default character json file for the agent
      const defaultCharacterJsonResult = await deployAgentDefaultCharacterJsonFile(agentId, composeResult.composePath, agentData.configuration);
      console.log({DEFAULTCHARACTERJSONRESULT: defaultCharacterJsonResult});

      // deploy the agent docker compose file
      const deployResult = await deployAgentDockerComposeFile(agentId, composeResult.composePath);
      console.log({DEPLOYRESULT: deployResult});

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

      // create agent subdomain
      const { agentAlias, agentSubdomain, agentServerIp } = await createAgentSubdomain(composeResult.composePath);

      await updateAgentContainerWithDefaultCharacterJson(containerId, defaultCharacterJsonResult.characterFilePath, '/app/characters' );

      await updateAgentContainerId(agentId, `${containerId}:${newAgentServerPort ?? '3300'}`);
      
      // update the agent data with the container id
      //agentData.containerId = `${containerId}:${newAgentServerPort ?? '3300'}`;
      
      // get the agent client id
      const agentClientId = await getDeployedAgentClientId(containerId, agentData.name as string);

      // update the agent data with the container metadata
      const containerMetadata = await getAgentContainerMetadata(composeResult.composePath);
      agentData.metadata.composePath = containerMetadata.composePath;
      agentData.metadata.agentAlias = containerMetadata.agentAlias;
      agentData.metadata.agentClientId = agentClientId;
      agentData.metadata.agentHost = agentAlias;
      agentData.metadata.agentSubdomain = agentSubdomain;
      agentData.metadata.agentServerIp = agentServerIp;
      await updateAgentContainerMetadata(agentId, agentData.metadata);

      console.log({AGENTDATA: agentData});

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