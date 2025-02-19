export interface CloudflareCredentials {
    apiToken: string;
    zoneId: string;
  }
  
  interface AddSubdomainParams extends CloudflareCredentials {
    /** Fully qualified subdomain name, e.g. "sub.example.com" */
    subdomain: string;
    /** DNS record type; default is "A" */
    type?: string;
    /** Content for the record (e.g. an IP address or CNAME target) */
    content: string;
    /** Time To Live (in seconds); 1 means "automatic" */
    ttl?: number;
    /** Whether Cloudflare's proxy is enabled for the record */
    proxied?: boolean;
  }
  
  /**
   * Adds a DNS record (subdomain) to a Cloudflare zone.
   *
   * @param params - Parameters required to add the subdomain.
   * @returns A promise resolving to the Cloudflare API response.
   */
  export async function addSubdomain(params: AddSubdomainParams): Promise<any> {
    const {
      apiToken,
      zoneId,
      subdomain,
      type = 'A',
      content,
      ttl = 1,
      proxied = false,
    } = params;
  
    const url = `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`;
  
    const body = {
      type,
      name: subdomain,
      content,
      ttl,
      proxied,
    };
  
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(`Error adding subdomain: ${JSON.stringify(data)}`);
    }
    return data;
  }
  
  interface RemoveSubdomainParams extends CloudflareCredentials {
    /** Fully qualified subdomain name, e.g. "sub.example.com" */
    subdomain: string;
  }
  
  /**
   * Removes a DNS record (subdomain) from a Cloudflare zone.
   *
   * @param params - Parameters required to remove the subdomain.
   * @returns A promise resolving to the Cloudflare API response.
   */
  export async function removeSubdomain(params: RemoveSubdomainParams): Promise<any> {
    const { apiToken, zoneId, subdomain } = params;
  
    // First, fetch the DNS record details for the subdomain
    const getUrl = `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records?name=${encodeURIComponent(
      subdomain
    )}`;
  
    const getResponse = await fetch(getUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
    });
  
    const getData = await getResponse.json();
    if (!getResponse.ok || !getData.success || getData.result.length === 0) {
      throw new Error(`DNS record not found for subdomain: ${subdomain}`);
    }
  
    // Assume the first matching record is the one to remove.
    const recordId = getData.result[0].id;
    const deleteUrl = `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records/${recordId}`;
  
    const deleteResponse = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
    });
  
    const deleteData = await deleteResponse.json();
    if (!deleteResponse.ok || !deleteData.success) {
      throw new Error(`Error removing subdomain: ${JSON.stringify(deleteData)}`);
    }
    return deleteData;
  }