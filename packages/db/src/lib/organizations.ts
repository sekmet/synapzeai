export async function createOrganization(name: string, subscriptionStatus: string, billingEmail: string) {
  try {
    const now = new Date().toISOString();
    const result = await Bun.sql`
      INSERT INTO organizations (name, subscription_status, billing_email, created_at, updated_at)
      VALUES (${name}, ${subscriptionStatus}, ${billingEmail}, ${now}, ${now})
      RETURNING *
    `.values();

    return result[0] ?? null;
  } catch (error) {
    console.error('Failed to create organization:', error);
    throw error;
  }
}

export async function getOrganizationById(id: string) {
  try {
    const org = await Bun.sql`
      SELECT * FROM organizations 
      WHERE id = ${id}
    `.values();

    const members = await Bun.sql`
      SELECT om.*, u.email
      FROM organization_members om
      LEFT JOIN users u ON om.user_id = u.id
      WHERE om.organization_id = ${id}
    `.values();

    const agents = await Bun.sql`
      SELECT *
      FROM agents
      WHERE organization_id = ${id}
    `.values();

    return {
      ...org[0],
      members,
      agents
    };
  } catch (error) {
    console.error('Failed to get organization:', error);
    throw error;
  }
}

export async function updateOrganization(
  id: string, 
  name?: string, 
  subscriptionStatus?: string, 
  billingEmail?: string
) {
  try {
    const now = new Date().toISOString();
    const result = await Bun.sql`
      UPDATE organizations 
      SET name = COALESCE(${name}, name),
          subscription_status = COALESCE(${subscriptionStatus}, subscription_status),
          billing_email = COALESCE(${billingEmail}, billing_email),
          updated_at = ${now}
      WHERE id = ${id}
      RETURNING *
    `.values();

    return result[0] ?? null;
  } catch (error) {
    console.error('Failed to update organization:', error);
    throw error;
  }
}

export async function deleteOrganization(id: string) {
  try {
    // Delete associated records first
    await Bun.sql`DELETE FROM organization_members WHERE organization_id = ${id}`;
    await Bun.sql`DELETE FROM agents WHERE organization_id = ${id}`;
    
    // Finally delete the organization
    const result = await Bun.sql`
      DELETE FROM organizations 
      WHERE id = ${id}
      RETURNING id
    `.values();

    return result[0]?.id ? true : false;
  } catch (error) {
    console.error('Failed to delete organization:', error);
    throw error;
  }
}
