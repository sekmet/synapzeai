import { removeSubdomain, type CloudflareCredentials } from './cloudflare';

export const removeAgentSubdomain = async (composePath: string) => {

    // Extract the directory from the composePath.
    const agentAlias = `${composePath.split('/').pop()}`.toLocaleLowerCase();
    const agentServerDomain = process.env.AGENT_SERVER_DOMAIN;
  
    if (!agentServerDomain) {
      console.log('Environment variables AGENT_SERVER_DOMAIN are missing.');
      return;
    }

    const credentials: CloudflareCredentials = {
      apiToken: `${process.env.CLOUDFLARE_API_TOKEN}`,
      zoneId: `${process.env.ZONE_ID}`,
    };
  
    console.log('Credentials:', credentials);
    console.log({
      subdomain: `${agentAlias}.${agentServerDomain}`
    })
    try {
      //Removing a subdomain
      const removeResult = await removeSubdomain({
        ...credentials,
        subdomain: `${agentAlias}.${agentServerDomain}`,
      });
      
      console.log('Subdomain removed:', removeResult);

    } catch (error) {
      console.error(error);
    }
  
    return {
      agentAlias,
      agentSubdomain: `https://${agentAlias}.${agentServerDomain}`,
    }
  }
  