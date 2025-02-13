interface AgentConfig {
  [key: string]: any;
}

export async function createAgent(
  organizationId: string,
  name: string,
  description: string,
  status: string,
  version: string,
  configuration: AgentConfig,
  metadata: AgentConfig
) {
  try {
    const now = new Date().toISOString();
    const result = await Bun.sql`
      INSERT INTO agents (
        organization_id, name, description, status, version, 
        configuration, metadata, created_at, updated_at
      )
      VALUES (
        ${organizationId}, ${name}, ${description}, ${status}, ${version}, 
        ${JSON.stringify(configuration)}::jsonb, ${JSON.stringify(metadata)}::jsonb,
        ${now}, ${now}
      )
      RETURNING *
    `.values();

    return result[0] ?? null;
  } catch (error) {
    console.error('Failed to create agent:', error);
    throw error;
  }
}

export async function getAgentById(id: string) {
  try {
    const agent = await Bun.sql`
      SELECT * FROM agents 
      WHERE id = ${id}
    `.values();

    const envVars = await Bun.sql`
      SELECT * FROM agent_environment_variables
      WHERE agent_id = ${id}
    `.values();

    const integrations = await Bun.sql`
      SELECT * FROM service_integrations
      WHERE agent_id = ${id}
    `.values();

    const deployments = await Bun.sql`
      SELECT * FROM deployment_history
      WHERE agent_id = ${id}
      ORDER BY created_at DESC
    `.values();

    const analytics = await Bun.sql`
      SELECT * FROM agent_analytics
      WHERE agent_id = ${id}
      ORDER BY timestamp DESC
    `.values();

    const logs = await Bun.sql`
      SELECT * FROM agent_logs
      WHERE agent_id = ${id}
      ORDER BY timestamp DESC
    `.values();

    return {
      ...agent[0],
      envVars,
      integrations,
      deployments,
      analytics,
      logs
    };
  } catch (error) {
    console.error('Failed to get agent:', error);
    throw error;
  }
}

export async function updateAgent(
  id: string,
  name?: string,
  description?: string,
  status?: string,
  version?: string,
  configuration?: AgentConfig,
  metadata?: AgentConfig
) {
  try {
    const now = new Date().toISOString();
    const result = await Bun.sql`
      UPDATE agents 
      SET name = COALESCE(${name}, name),
          description = COALESCE(${description}, description),
          status = COALESCE(${status}, status),
          version = COALESCE(${version}, version),
          configuration = COALESCE(${JSON.stringify(configuration)}::jsonb, configuration),
          metadata = COALESCE(${JSON.stringify(metadata)}::jsonb, metadata),
          updated_at = ${now}
      WHERE id = ${id}
      RETURNING *
    `.values();

    return result[0] ?? null;
  } catch (error) {
    console.error('Failed to update agent:', error);
    throw error;
  }
}

export async function deleteAgent(id: string) {
  try {
    // Delete associated records first
    await Bun.sql`DELETE FROM agent_environment_variables WHERE agent_id = ${id}`;
    await Bun.sql`DELETE FROM service_integrations WHERE agent_id = ${id}`;
    await Bun.sql`DELETE FROM deployment_history WHERE agent_id = ${id}`;
    await Bun.sql`DELETE FROM agent_analytics WHERE agent_id = ${id}`;
    await Bun.sql`DELETE FROM agent_logs WHERE agent_id = ${id}`;
    await Bun.sql`DELETE FROM blockchain_integrations WHERE agent_id = ${id}`;

    // Finally delete the agent
    const result = await Bun.sql`
      DELETE FROM agents 
      WHERE id = ${id}
      RETURNING id
    `.values();

    return result[0]?.id ? true : false;
  } catch (error) {
    console.error('Failed to delete agent:', error);
    throw error;
  }
}

export async function getAgentsAndStatsByOrganizationId(organizationId: string) {
  try {
    const _agents = await Bun.sql`
      SELECT a.*, 
        (SELECT COUNT(*) FROM agent_environment_variables WHERE agent_id = a.id) as env_vars_count,
        (SELECT COUNT(*) FROM service_integrations WHERE agent_id = a.id) as integrations_count,
        (SELECT COUNT(*) FROM deployment_history WHERE agent_id = a.id) as deployments_count,
        (SELECT COUNT(*) FROM agent_analytics WHERE agent_id = a.id) as analytics_count,
        (SELECT COUNT(*) FROM agent_logs WHERE agent_id = a.id) as logs_count,
        (SELECT COUNT(*) FROM blockchain_integrations WHERE agent_id = a.id) as blockchain_integrations_count
      FROM agents a
      WHERE a.organization_id = ${organizationId}
      ORDER BY a.created_at DESC
    `.values();

    const agents = _agents.map((agent: any) => {
      return {
        id: agent[0],
        organization_id: agent[1],
        name: agent[2],
        description: agent[3],
        status: agent[4],
        version: agent[5],
        created_at: agent[6],
        updated_at: agent[7],
        last_active: agent[8],
        deployment_count: agent[9],
        configuration: JSON.parse(agent[10]),
        metadata: JSON.parse(agent[11]),
        env_vars_count: 0,
        integrations_count: 0,
        deployments_count: 0,
        analytics_count: 0,
        logs_count: 0,
        blockchain_integrations_count: 0
      }
    })

    return agents;
  } catch (error) {
    console.error('Failed to get agents by organization ID:', error);
    throw error;
  }
}


export async function getAgentsByOrganizationId(organizationId: string) {
  try {
    const _agents = await Bun.sql`
      SELECT * FROM agents 
      WHERE organization_id = ${organizationId} 
      AND status = 'active'
      ORDER BY created_at DESC
    `.values();

    const agents = _agents.map((agent: any) => {
      return {
        id: agent[0],
        organization_id: agent[1],
        logo: '',
        name: agent[2],
        description: agent[3],
        status: agent[4],
        version: agent[5],
        created_at: agent[6],
        updated_at: agent[7],
        last_active: agent[8],
        deployment_count: agent[9],
        configuration: JSON.parse(agent[10]),
        metadata: JSON.parse(agent[11]),
        plan: 'basic'
      }
    })

    return agents;
  } catch (error) {
    console.error('Failed to get agents by organization ID:', error);
    throw error;
  }
}