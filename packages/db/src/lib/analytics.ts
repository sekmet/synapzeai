interface MetricValue {
  [key: string]: any;
}

interface MetricContext {
  [key: string]: any;
}

interface LogContext {
  [key: string]: any;
}

export async function createAgentAnalytics(
  agentId: string,
  metricType: string,
  metricValue: MetricValue,
  context: MetricContext
) {
  try {
    const now = new Date().toISOString();
    const result = await Bun.sql`
      INSERT INTO agent_analytics (
        agent_id, metric_type, metric_value, context,
        timestamp, created_at, updated_at
      )
      VALUES (
        ${agentId}, ${metricType},
        ${JSON.stringify(metricValue)}::jsonb,
        ${JSON.stringify(context)}::jsonb,
        ${now}, ${now}, ${now}
      )
      RETURNING *
    `.values();

    return result[0] ?? null;
  } catch (error) {
    console.error('Failed to create agent analytics:', error);
    throw error;
  }
}

export async function createAgentLog(
  agentId: string,
  logMessage: string,
  context: LogContext
) {
  try {
    const now = new Date().toISOString();
    const result = await Bun.sql`
      INSERT INTO agent_logs (
        agent_id, log_message, context,
        timestamp, created_at, updated_at
      )
      VALUES (
        ${agentId}, ${logMessage},
        ${JSON.stringify(context)}::jsonb,
        ${now}, ${now}, ${now}
      )
      RETURNING *
    `.values();

    return result[0] ?? null;
  } catch (error) {
    console.error('Failed to create agent log:', error);
    throw error;
  }
}

export async function getAgentAnalytics(
  agentId: string,
  metricType?: string,
  startTime?: Date,
  endTime?: Date,
  limit: number = 100
) {
  try {
    let query = Bun.sql`
      SELECT * FROM agent_analytics
      WHERE agent_id = ${agentId}
    `;

    if (metricType) {
      query = Bun.sql`${query} AND metric_type = ${metricType}`;
    }

    if (startTime) {
      query = Bun.sql`${query} AND timestamp >= ${startTime.toISOString()}`;
    }

    if (endTime) {
      query = Bun.sql`${query} AND timestamp <= ${endTime.toISOString()}`;
    }

    query = Bun.sql`${query} 
      ORDER BY timestamp DESC
      LIMIT ${limit}
    `;

    const result = await query.values();
    return result;
  } catch (error) {
    console.error('Failed to get agent analytics:', error);
    throw error;
  }
}

export async function getAgentLogs(
  agentId: string,
  startTime?: Date,
  endTime?: Date,
  limit: number = 100
) {
  try {
    let query = Bun.sql`
      SELECT * FROM agent_logs
      WHERE agent_id = ${agentId}
    `;

    if (startTime) {
      query = Bun.sql`${query} AND timestamp >= ${startTime.toISOString()}`;
    }

    if (endTime) {
      query = Bun.sql`${query} AND timestamp <= ${endTime.toISOString()}`;
    }

    query = Bun.sql`${query} 
      ORDER BY timestamp DESC
      LIMIT ${limit}
    `;

    const result = await query.values();
    return result;
  } catch (error) {
    console.error('Failed to get agent logs:', error);
    throw error;
  }
}

export async function updateAgentAnalytics(
  id: string,
  metricType?: string,
  metricValue?: MetricValue,
  context?: MetricContext
) {
  try {
    const now = new Date().toISOString();
    const result = await Bun.sql`
      UPDATE agent_analytics 
      SET metric_type = COALESCE(${metricType}, metric_type),
          metric_value = COALESCE(${JSON.stringify(metricValue)}::jsonb, metric_value),
          context = COALESCE(${JSON.stringify(context)}::jsonb, context),
          updated_at = ${now}
      WHERE id = ${id}
      RETURNING *
    `.values();

    return result[0] ?? null;
  } catch (error) {
    console.error('Failed to update agent analytics:', error);
    throw error;
  }
}

export async function deleteAgentAnalytics(id: string) {
  try {
    const result = await Bun.sql`
      DELETE FROM agent_analytics 
      WHERE id = ${id}
      RETURNING id
    `.values();

    return result[0]?.id ? true : false;
  } catch (error) {
    console.error('Failed to delete agent analytics:', error);
    throw error;
  }
}

export async function deleteAgentLogs(id: string) {
  try {
    const result = await Bun.sql`
      DELETE FROM agent_logs 
      WHERE id = ${id}
      RETURNING id
    `.values();

    return result[0]?.id ? true : false;
  } catch (error) {
    console.error('Failed to delete agent log:', error);
    throw error;
  }
}
