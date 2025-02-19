import { addSubdomain, type CloudflareCredentials } from './cloudflare';

export const createAgentSubdomain = async (composePath: string) => {

    // Extract the directory from the composePath.
    const _composePath = composePath.split('/');
    _composePath.pop();
    const dirPath = _composePath.join('/');
    const agentAlias = `${dirPath.split('/').pop()}`.toLocaleLowerCase();
    const agentServerIp = process.env.AGENT_SERVER_IP;
    const agentServerDomain = process.env.AGENT_SERVER_DOMAIN;
  
    if (!agentServerIp || !agentServerDomain) {
      console.log('Environment variables AGENT_SERVER_IP or AGENT_SERVER_DOMAIN are missing.');
      return;
    }

    const credentials: CloudflareCredentials = {
      apiToken: `${process.env.CLOUDFLARE_API_TOKEN}`,
      zoneId: `${process.env.ZONE_ID}`,
    };
  
    console.log('Credentials:', credentials);
    console.log({
      subdomain: `${agentAlias}.${agentServerDomain}`,
      content: `${agentServerIp}`,
    });
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
  
    } catch (error) {
      console.error(error);
    }
  
    return {
      agentAlias,
      agentSubdomain: `https://${agentAlias}.${agentServerDomain}`,
      agentServerIp
    }
  }
  