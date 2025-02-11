interface ServiceCredentials {
  [key: string]: any;
}

interface ServiceConfig {
  [key: string]: any;
}

interface BlockchainConfig {
  [key: string]: any;
}

export async function createServiceIntegration(
  agentId: string,
  serviceType: string,
  credentials: ServiceCredentials,
  status: string,
  configuration: ServiceConfig
) {
  try {
    const now = new Date().toISOString();
    const result = await Bun.sql`
      INSERT INTO service_integrations (
        agent_id, service_type, credentials, status, 
        configuration, created_at, updated_at
      )
      VALUES (
        ${agentId}, ${serviceType}, 
        ${JSON.stringify(credentials)}::jsonb,
        ${status}, ${JSON.stringify(configuration)}::jsonb,
        ${now}, ${now}
      )
      RETURNING *
    `.values();

    return result[0] ?? null;
  } catch (error) {
    console.error('Failed to create service integration:', error);
    throw error;
  }
}

export async function createBlockchainIntegration(
  agentId: string,
  chainId: number,
  walletAddress: string,
  contractAddresses: Record<string, string>,
  status: string,
  chainConfig: BlockchainConfig
) {
  try {
    const now = new Date().toISOString();
    const result = await Bun.sql`
      INSERT INTO blockchain_integrations (
        agent_id, chain_id, wallet_address, contract_addresses,
        status, chain_config, created_at, updated_at
      )
      VALUES (
        ${agentId}, ${chainId}, ${walletAddress},
        ${JSON.stringify(contractAddresses)}::jsonb,
        ${status}, ${JSON.stringify(chainConfig)}::jsonb,
        ${now}, ${now}
      )
      RETURNING *
    `.values();

    return result[0] ?? null;
  } catch (error) {
    console.error('Failed to create blockchain integration:', error);
    throw error;
  }
}

export async function getServiceIntegrationById(id: string) {
  try {
    const result = await Bun.sql`
      SELECT * FROM service_integrations
      WHERE id = ${id}
    `.values();

    return result[0] ?? null;
  } catch (error) {
    console.error('Failed to get service integration:', error);
    throw error;
  }
}

export async function getBlockchainIntegrationById(id: string) {
  try {
    const result = await Bun.sql`
      SELECT * FROM blockchain_integrations
      WHERE id = ${id}
    `.values();

    return result[0] ?? null;
  } catch (error) {
    console.error('Failed to get blockchain integration:', error);
    throw error;
  }
}

export async function updateServiceIntegration(
  id: string,
  credentials?: ServiceCredentials,
  status?: string,
  configuration?: ServiceConfig
) {
  try {
    const now = new Date().toISOString();
    const result = await Bun.sql`
      UPDATE service_integrations 
      SET credentials = COALESCE(${JSON.stringify(credentials)}::jsonb, credentials),
          status = COALESCE(${status}, status),
          configuration = COALESCE(${JSON.stringify(configuration)}::jsonb, configuration),
          updated_at = ${now}
      WHERE id = ${id}
      RETURNING *
    `.values();

    return result[0] ?? null;
  } catch (error) {
    console.error('Failed to update service integration:', error);
    throw error;
  }
}

export async function updateBlockchainIntegration(
  id: string,
  walletAddress?: string,
  contractAddresses?: Record<string, string>,
  status?: string,
  chainConfig?: BlockchainConfig
) {
  try {
    const now = new Date().toISOString();
    const result = await Bun.sql`
      UPDATE blockchain_integrations 
      SET wallet_address = COALESCE(${walletAddress}, wallet_address),
          contract_addresses = COALESCE(${JSON.stringify(contractAddresses)}::jsonb, contract_addresses),
          status = COALESCE(${status}, status),
          chain_config = COALESCE(${JSON.stringify(chainConfig)}::jsonb, chain_config),
          updated_at = ${now}
      WHERE id = ${id}
      RETURNING *
    `.values();

    return result[0] ?? null;
  } catch (error) {
    console.error('Failed to update blockchain integration:', error);
    throw error;
  }
}

export async function deleteServiceIntegration(id: string) {
  try {
    const result = await Bun.sql`
      DELETE FROM service_integrations 
      WHERE id = ${id}
      RETURNING id
    `.values();

    return result[0]?.id ? true : false;
  } catch (error) {
    console.error('Failed to delete service integration:', error);
    throw error;
  }
}

export async function deleteBlockchainIntegration(id: string) {
  try {
    const result = await Bun.sql`
      DELETE FROM blockchain_integrations 
      WHERE id = ${id}
      RETURNING id
    `.values();

    return result[0]?.id ? true : false;
  } catch (error) {
    console.error('Failed to delete blockchain integration:', error);
    throw error;
  }
}
