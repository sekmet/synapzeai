import { v4 as uuidv4 } from 'uuid';

// Agent API functions
interface AgentData {
  id?: string;
  organizationId?: string;
  name?: string;
  description?: string;
  status?: string;
  version?: string;
  configuration?: any;
  metadata?: any;
}

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

export const updateAgentDeployment = async (agentData: AgentData) => {
  if (!agentData.id) {
    // If no ID is provided, create a new agent
    return createAgent(agentData);
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
