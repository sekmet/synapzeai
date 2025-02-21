import { executeCommandOnAgentContainer } from "./agent";

/**
 * Cleans up and parses a JSON string representing an array of objects.
 *
 * @param outputString - The JSON string to clean and parse.
 * @returns An array of objects representing the parsed JSON, or undefined if parsing fails.
 */
export function parseReportsOutputSQlite(output:string): any[] | undefined {
// Trim any extraneous whitespace and newline characters.
const cleanedOutput = output.trim();

try {
    // Parse the cleaned JSON string.
    const parsed = JSON.parse(cleanedOutput);

    // Ensure the result is an array.
    if (!Array.isArray(parsed)) {
    throw new Error('Parsed output is not an array.');
    }

    return parsed;
} catch (error) {
    console.error('Error parsing output string:', error);
    return [];
}
}

// ################################ 1. Engaged Sessions

export const getAgentEngagedSessions = async (containerId: string) => {
    if (!containerId) {
        console.error('Container ID is required');
        return []
    }

    const Cmd = ["/root/.local/bin/sqlite-utils", "/app/agent/data/db.sqlite", "SELECT DATE(createdAt / 1000, 'unixepoch') AS date, COUNT(*) AS sessions FROM memories GROUP BY DATE(createdAt) ORDER BY date;"];
    const AttachStdout =  true; 
    const AttachStderr = true;
  
    const response = await executeCommandOnAgentContainer(containerId, Cmd, AttachStdout, AttachStderr);
  
    if (!response || !response.output) {
      throw new Error(`Failed to execute the command on the agent container: ${Cmd}`);
    }
    
    console.log('CLIENT RESPONSE', response.output);
  
    const parsedOutput = parseReportsOutputSQlite(response.output);
    console.log('CLIENT RESPONSE Parsed', parsedOutput);
  
    return parsedOutput;
  }


// ################################ 2. Handle Time

export const getAgentHandleTime = async (containerId: string) => {
    if (!containerId) {
        console.error('Container ID is required');
        return []
    }


    const Cmd = ["/root/.local/bin/sqlite-utils", "/app/agent/data/db.sqlite", "SELECT DATE(createdAt / 1000, 'unixepoch') AS date, ROUND(AVG(CAST((createdAt - prev_created) AS FLOAT) / 1000 / 60), 2) AS avg_handle_time_min FROM (SELECT createdAt, (SELECT MAX(createdAt) FROM memories m2 WHERE m2.createdAt < m1.createdAt AND m2.roomId = m1.roomId) as prev_created FROM memories m1 ) WHERE prev_created IS NOT NULL GROUP BY date ORDER BY date;"];
    const AttachStdout =  true; 
    const AttachStderr = true;
  
    const response = await executeCommandOnAgentContainer(containerId, Cmd, AttachStdout, AttachStderr);
  
    if (!response || !response.output) {
      throw new Error(`Failed to execute the command on the agent container: ${Cmd}`);
    }
    
    console.log('CLIENT RESPONSE', response.output);
  
    const parsedOutput = parseReportsOutputSQlite(response.output);
    console.log('CLIENT RESPONSE Parsed', parsedOutput);
  
    return parsedOutput;
  }


// ################################ 3. CSAT (Customer Satisfaction)

export const getAgentCustomerSatisfactionScore = async (containerId: string) => {
    if (!containerId) {
        console.error('Container ID is required');
        return []
    }

    const Cmd = ["/root/.local/bin/sqlite-utils", "/app/agent/data/db.sqlite", "SELECT DATE(createdAt / 1000, 'unixepoch') AS date, AVG(CAST(json_extract(body, '$.csat') AS REAL)) AS avg_csat FROM logs WHERE type = 'csat' GROUP BY DATE(createdAt) ORDER BY date;"];
    const AttachStdout =  true; 
    const AttachStderr = true;
  
    const response = await executeCommandOnAgentContainer(containerId, Cmd, AttachStdout, AttachStderr);
  
    if (!response || !response.output) {
      throw new Error(`Failed to execute the command on the agent container: ${Cmd}`);
    }
    
    console.log('CLIENT RESPONSE', response.output);
  
    const parsedOutput = parseReportsOutputSQlite(response.output);
    console.log('CLIENT RESPONSE Parsed', parsedOutput);
  
    return parsedOutput;
  }


// ################################ 4. Sentiment

export const getAgentSentimentScore = async (containerId: string) => {
    if (!containerId) {
        console.error('Container ID is required');
        return []
    }

    const Cmd = ["/root/.local/bin/sqlite-utils", "/app/agent/data/db.sqlite", "SELECT CAST(json_extract(body, '$.sentiment') AS TEXT) AS sentiment, (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM logs WHERE type = 'sentiment')) AS percentage FROM logs WHERE type = 'sentiment' GROUP BY body;"];
    const AttachStdout =  true; 
    const AttachStderr = true;
  
    const response = await executeCommandOnAgentContainer(containerId, Cmd, AttachStdout, AttachStderr);
  
    if (!response || !response.output) {
      throw new Error(`Failed to execute the command on the agent container: ${Cmd}`);
    }
    
    console.log('CLIENT RESPONSE', response.output);
  
    const parsedOutput = parseReportsOutputSQlite(response.output);
    console.log('CLIENT RESPONSE Parsed', parsedOutput);
  
    return parsedOutput;
  }


// ################################ 5. Agent Performance

export const getAgentPerformanceStats = async (containerId: string, agentName: string) => {
    if (!containerId) {
        console.error('Container ID is required');
        return []
    }

    const Cmd = ["/root/.local/bin/sqlite-utils", "/app/agent/data/db.sqlite", "select id from accounts where name = '" + agentName + "'"];
    const AttachStdout =  true; 
    const AttachStderr = true;
  
    const response = await executeCommandOnAgentContainer(containerId, Cmd, AttachStdout, AttachStderr);
  
    if (!response || !response.output) {
      throw new Error(`Failed to execute the command on the agent container: ${Cmd}`);
    }
    
    console.log('CLIENT RESPONSE', response.output);
  
    const parsedOutput = parseReportsOutputSQlite(response.output);
    console.log('CLIENT RESPONSE Parsed', parsedOutput);
  
    return parsedOutput;
  }