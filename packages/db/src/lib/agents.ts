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
