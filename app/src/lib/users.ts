export const fetchCurrentUser = async (id: string) => {
    const response = await fetch(`${import.meta.env.VITE_API_DB_HOST_URL}/v1/users/${id}`,{
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_JWT_DB_API}`,
        'Content-Type': 'application/json',
      }
    });
    return response.json();
  };
  
  export const createUser = async (id: string, emailAddress: string, linkedAccounts: any[], mfaMethods: any[], hasAcceptedTerms: boolean, createdAt: string | Date) => {
    // Create user
    const userResponse = await fetch(`${import.meta.env.VITE_API_DB_HOST_URL}/v1/users`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_JWT_DB_API}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, emailAddress, linkedAccounts, mfaMethods, hasAcceptedTerms, createdAt }),
    });
    const createdUser = await userResponse.json();
  
    // Check if user has an organization
    /*const orgsResponse = await fetch(`${import.meta.env.VITE_API_DB_HOST_URL}/v1/organizations`,{
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_JWT_DB_API}`,
        'Content-Type': 'application/json',
      }
    });
    const organizations = await orgsResponse.json();
    
    const userOrg = organizations?.length > 0 && organizations?.find((org: any) => 
      org.members?.some((member: any) => member.user_id === id)
    );*/
    // Fetch current user's organization
    const orgsResponse = await fetch(`${import.meta.env.VITE_API_DB_HOST_URL}/v1/organizations/${id}/organization`,{
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_JWT_DB_API}`,
        'Content-Type': 'application/json',
      }
    });
    const organization = await orgsResponse.json();
    
    //const userOrg = organizations?.length > 0 && organizations.find((org: any) => 
    //  org.members?.some((member: any) => member.user_id === currentUserId)
    //);
  
    //console.log({OERGANIZATION: organization})
  
    if (!organization[0]) {
      // Create default organization
      const orgResponse = await fetch(`${import.meta.env.VITE_API_DB_HOST_URL}/v1/organizations`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_JWT_DB_API}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Default Organization',
          subscriptionStatus: 'active',
          billingEmail: emailAddress
        }),
      });
      const createdOrg = await orgResponse.json();
      //console.log({createdOrg})
  
      // Add user as organization member
      await fetch(`${import.meta.env.VITE_API_DB_HOST_URL}/v1/organizations/${createdOrg[0]}/members`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_JWT_DB_API}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: id, //createdUser[0],
          role: 'owner'
        }),
      });
    }
  
    return createdUser;
  };