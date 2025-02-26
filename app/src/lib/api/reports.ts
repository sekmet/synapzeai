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
    if (!containerId || containerId === 'undefined') {
        console.error('Container ID is required');
        return []
    }

    const Cmd = ["/root/.local/bin/sqlite-utils", "/app/agent/data/db.sqlite", "SELECT DATE(createdAt / 1000, 'unixepoch') AS date, COUNT(DISTINCT roomId) AS sessions FROM memories GROUP BY DATE(createdAt) ORDER BY date;"];
    const AttachStdout =  true; 
    const AttachStderr = true;
  
    const response = await executeCommandOnAgentContainer(containerId, Cmd, AttachStdout, AttachStderr);
  
    if (!response || !response.output) {
      throw new Error(`Failed to execute the command on the agent container: ${Cmd}`);
    }
    
    //onsole.log('CLIENT RESPONSE', response.output);
  
    const parsedOutput = parseReportsOutputSQlite(response.output);
    //console.log('CLIENT RESPONSE Parsed', parsedOutput);
  
    return parsedOutput;
  }


// ################################ 2. Handle Time

export const getAgentHandleTime = async (containerId: string) => {
    if (!containerId || containerId === 'undefined') {
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
    
    //console.log('CLIENT RESPONSE', response.output);
  
    const parsedOutput = parseReportsOutputSQlite(response.output);
    //console.log('CLIENT RESPONSE Parsed', parsedOutput);
  
    return parsedOutput;
  }


// ################################ 3. CSAT (Customer Satisfaction)

export const getAgentCustomerSatisfactionScore = async (containerId: string) => {
    if (!containerId || containerId === 'undefined') {
        console.error('Container ID is required');
        return []
    }

    const Cmd = ["/root/.local/bin/sqlite-utils", "/app/agent/data/db.sqlite", "SELECT DATE(createdAt) AS date, ROUND(AVG(CAST(json_extract(body, '$.csat') AS REAL)), 2) AS avg_csat FROM logs WHERE type = 'csat' GROUP BY DATE(createdAt) ORDER BY date;"];
    const AttachStdout =  true; 
    const AttachStderr = true;
  
    const response = await executeCommandOnAgentContainer(containerId, Cmd, AttachStdout, AttachStderr);
  
    if (!response || !response.output) {
      throw new Error(`Failed to execute the command on the agent container: ${Cmd}`);
    }
    
    //console.log('CLIENT RESPONSE', response.output);
  
    const parsedOutput = parseReportsOutputSQlite(response.output);
    //console.log('CLIENT RESPONSE Parsed', parsedOutput);
  
    return parsedOutput;
  }


// ################################ 4. Sentiment

export const getAgentSentimentScore = async (containerId: string) => {
    if (!containerId || containerId === 'undefined') {
        console.error('Container ID is required');
        return []
    }

    const Cmd = ["/root/.local/bin/sqlite-utils", "/app/agent/data/db.sqlite", "SELECT CAST(json_extract(body, '$.sentiment') AS TEXT) AS name, ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM logs WHERE type = 'sentiment'), 2) AS percentage FROM logs WHERE type = 'sentiment' GROUP BY body;"];
    const AttachStdout =  true; 
    const AttachStderr = true;
  
    const response = await executeCommandOnAgentContainer(containerId, Cmd, AttachStdout, AttachStderr);
  
    if (!response || !response.output) {
      throw new Error(`Failed to execute the command on the agent container: ${Cmd}`);
    }
    
    //console.log('CLIENT RESPONSE', response.output);
  
    const parsedOutput = parseReportsOutputSQlite(response.output);
    //console.log('CLIENT RESPONSE Parsed', parsedOutput);
  
    return parsedOutput;
  }

// ##################### WIDGETS ###########################################

// ################################ 1. Engaged Sessions - widget

export const getEngagedSessions = async (containerId: string) => {
    if (!containerId || containerId === 'undefined') {
        console.error('Container ID is required');
        return []
    }

    const Cmd = ["/root/.local/bin/sqlite-utils", "/app/agent/data/db.sqlite", "SELECT COUNT(DISTINCT roomId) AS engaged_sessions FROM memories;"];
    const AttachStdout =  true; 
    const AttachStderr = true;
  
    const response = await executeCommandOnAgentContainer(containerId, Cmd, AttachStdout, AttachStderr);
  
    if (!response || !response.output) {
      throw new Error(`Failed to execute the command on the agent container: ${Cmd}`);
    }
    
    //console.log('CLIENT RESPONSE', response.output);
  
    const parsedOutput = parseReportsOutputSQlite(response.output);
    //console.log('CLIENT RESPONSE Parsed', parsedOutput);
  
    return parsedOutput;
  }


// ################################ 2. Sessions Rejected/Time - widget

export const getSessionsRejectedTime = async (containerId: string) => {
    if (!containerId || containerId === 'undefined') {
        console.error('Container ID is required');
        return []
    }

    const Cmd = ["/root/.local/bin/sqlite-utils", "/app/agent/data/db.sqlite", "SELECT (COUNT(DISTINCT CASE WHEN l.type = 'rejected' THEN l.roomId END) * 100.0 / COUNT(DISTINCT m.roomId)) AS sessions_rejected_percentage FROM memories m LEFT JOIN logs l ON m.roomId = l.roomId;"];
    const AttachStdout =  true; 
    const AttachStderr = true;
  
    const response = await executeCommandOnAgentContainer(containerId, Cmd, AttachStdout, AttachStderr);
  
    if (!response || !response.output) {
      throw new Error(`Failed to execute the command on the agent container: ${Cmd}`);
    }
    
    //console.log('CLIENT RESPONSE', response.output);
  
    const parsedOutput = parseReportsOutputSQlite(response.output);
    //console.log('CLIENT RESPONSE Parsed', parsedOutput);
  
    return parsedOutput;
  }


// ################################ 3. Transfer Rate - widget

export const getTransferRate = async (containerId: string) => {
    if (!containerId || containerId === 'undefined') {
        console.error('Container ID is required');
        return []
    }

    const Cmd = ["/root/.local/bin/sqlite-utils", "/app/agent/data/db.sqlite", "SELECT (COUNT(DISTINCT CASE WHEN l.type = 'transfer' THEN l.roomId END) * 100.0 / COUNT(DISTINCT m.roomId)) AS transfer_rate FROM memories m LEFT JOIN logs l ON m.roomId = l.roomId;"];
    const AttachStdout =  true; 
    const AttachStderr = true;
  
    const response = await executeCommandOnAgentContainer(containerId, Cmd, AttachStdout, AttachStderr);
  
    if (!response || !response.output) {
      throw new Error(`Failed to execute the command on the agent container: ${Cmd}`);
    }
    
    //console.log('CLIENT RESPONSE', response.output);
  
    const parsedOutput = parseReportsOutputSQlite(response.output);
    //console.log('CLIENT RESPONSE Parsed', parsedOutput);
  
    return parsedOutput;
  }


// ################################ 4. Avg. Session Handle Time - widget

export const getAvgSessionHandleTime = async (containerId: string) => {
    if (!containerId || containerId === 'undefined') {
        console.error('Container ID is required');
        return []
    }

    const Cmd = ["/root/.local/bin/sqlite-utils", "/app/agent/data/db.sqlite", "SELECT ROUND(AVG(met_target), 2) AS avg_handle_time_percentage FROM (SELECT roomId, CASE WHEN (MAX(createdAt) - MIN(createdAt)) / 60000.0 <= 3 THEN 100.0 ELSE 0.0 END AS met_target FROM memories GROUP BY roomId ) AS session_targets;"];
    const AttachStdout =  true; 
    const AttachStderr = true;
  
    const response = await executeCommandOnAgentContainer(containerId, Cmd, AttachStdout, AttachStderr);
  
    if (!response || !response.output) {
      throw new Error(`Failed to execute the command on the agent container: ${Cmd}`);
    }
    
    //console.log('CLIENT RESPONSE', response.output);
  
    const parsedOutput = parseReportsOutputSQlite(response.output);
    //console.log('CLIENT RESPONSE Parsed', parsedOutput);
  
    return parsedOutput;
  }


// ################################ 5. Avg. CSAT - widget

export const getAvgCsat = async (containerId: string) => {
    if (!containerId || containerId === 'undefined') {
        console.error('Container ID is required');
        return []
    }

    const Cmd = ["/root/.local/bin/sqlite-utils", "/app/agent/data/db.sqlite", "SELECT ROUND(AVG(CAST(json_extract(body, '$.csat') AS REAL)), 2) AS avg_csat FROM logs WHERE type = 'csat';"];
    const AttachStdout =  true; 
    const AttachStderr = true;
  
    const response = await executeCommandOnAgentContainer(containerId, Cmd, AttachStdout, AttachStderr);
  
    if (!response || !response.output) {
      throw new Error(`Failed to execute the command on the agent container: ${Cmd}`);
    }
    
    //console.log('CLIENT RESPONSE', response.output);
  
    const parsedOutput = parseReportsOutputSQlite(response.output);
    //console.log('CLIENT RESPONSE Parsed', parsedOutput);
  
    return parsedOutput;
  }



// ################################ 6. Avg. Session Sentiment - widget

export const getAvgSessionSentiment = async (containerId: string) => {
    if (!containerId || containerId === 'undefined') {
        console.error('Container ID is required');
        return []
    }

    const Cmd = ["/root/.local/bin/sqlite-utils", "/app/agent/data/db.sqlite", "SELECT ROUND(AVG(room_avg_sentiment),2) * 100 AS avg_session_sentiment_percentage FROM (SELECT roomId, AVG(CASE WHEN json_extract(body, '$.sentiment') = 'negative' THEN 0 WHEN json_extract(body, '$.sentiment') = 'neutral' THEN 0.5 WHEN json_extract(body, '$.sentiment') = 'positive' THEN 1 ELSE NULL END ) AS room_avg_sentiment FROM logs WHERE type = 'sentiment' GROUP BY roomId ) AS room_sentiments;"];
    const AttachStdout =  true; 
    const AttachStderr = true;
  
    const response = await executeCommandOnAgentContainer(containerId, Cmd, AttachStdout, AttachStderr);
  
    if (!response || !response.output) {
      throw new Error(`Failed to execute the command on the agent container: ${Cmd}`);
    }
    
    //console.log('CLIENT RESPONSE', response.output);
  
    const parsedOutput = parseReportsOutputSQlite(response.output);
    //console.log('CLIENT RESPONSE Parsed', parsedOutput);
  
    return parsedOutput;
  }


// ##################### PERFORMANCE ###########################################

// ################################ 10. Agent Performance

export const getAgentPerformanceStats = async (containerId: string, agentName: string) => {
    if (!containerId || containerId === 'undefined') {
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
    
    //console.log('CLIENT RESPONSE', response.output);
  
    const parsedOutput = parseReportsOutputSQlite(response.output);
    //console.log('CLIENT RESPONSE Parsed', parsedOutput);
  
    return parsedOutput;
  }