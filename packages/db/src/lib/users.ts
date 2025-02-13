import { sql } from 'bun';

export async function getUserById(id: string) {
    try {
        // Construct the SQL query
        // Only add set clauses for fields that are not empty
        const values: any[] = [];

        if (id !== undefined) {
          values.push(id);
        }

        //await Bun.sql`PREPARE user_profile AS SELECT * FROM users WHERE id = '$1'`;
        //await Bun.sql`PREPARE user_profile AS SELECT * FROM users WHERE id = $1`;
        // Count all existing entries
        const userProfile = await Bun.sql`SELECT * FROM users WHERE id = ${id}`.values();

        //console.log("USER PROFILE", userProfile)

        const linkedAccounts = await Bun.sql`
        SELECT *
        FROM linked_accounts
        WHERE user_id = ${id}`.values();
        //LEFT JOIN linked_accounts ON users.id = linked_accounts.user_id

        //console.log("LINKED ACCOUNTS", linkedAccounts)

        const wallets = Bun.sql`
        SELECT *
        FROM user_wallets
        WHERE user_id = ${id}`.values();
        //LEFT JOIN  ON users.id = user_wallets.user_id

        //console.log("WALLETS", wallets)

        // set farcaster data
        let farcasterAccount: any = null;
        const isFarcaster = linkedAccounts.filter((lacc: any) => lacc?.type === 'farcaster');
        if (isFarcaster?.length > 0) {
         farcasterAccount = {
          bio: isFarcaster[0]?.bio,
          displayName: isFarcaster[0]?.display_name,
          fid: isFarcaster[0]?.fid,
          ownerAddress: isFarcaster[0]?.owner_address,
          pfp: isFarcaster[0]?.pfp,
          username: isFarcaster[0]?.username,
        } 

        }

        const user = {
          id: userProfile[0][0],
          createdAt: userProfile[0][1],
          email: userProfile[0][2],
          verified: userProfile[0][3],
          updatedAt: userProfile[0][4],
          lastLogin: userProfile[0][5],
          hasAcceptedTerms: userProfile[0][6],
          farcaster: farcasterAccount ?? null,
          linkedAccounts: linkedAccounts,
          wallets: wallets
        }
        console.log('USER', user)
        return user;

      } catch (error) {
        console.log(error)
      }
}

export async function createUser(id: string, emailAddress: string, linkedAccounts: any[], mfaMethods: any[], hasAcceptedTerms: boolean, createdAt: string | Date) {
  try {
    // Check if user exists
    const existingUser = await Bun.sql`
      SELECT * FROM users WHERE id = ${id} LIMIT 1
    `.values();

    // If the user exists, return their details
    if (existingUser.length > 0) {
      return id;
    }

    // Insert user
    const now = new Date().toISOString();
    await Bun.sql`
      INSERT INTO users (id, email_address, created_at, updated_at, last_login_at, has_accepted_terms)
      VALUES (${id}, ${emailAddress}, ${createdAt}, ${now}, ${now}, ${hasAcceptedTerms})
    `;

    // Insert linked accounts
    for (const account of linkedAccounts) {
      await Bun.sql`
        INSERT INTO linked_accounts (
          user_id, type, fid, owner_address, display_name, username, bio, pfp, 
          verified_at, address, number, chain_id, chain_type, connector_type, 
          recovery_method, wallet_client, wallet_client_type
        ) VALUES (
          ${id}, ${account.type}, ${account.fid}, ${account.ownerAddress}, 
          ${account.displayName}, ${account.username}, ${account.bio}, 
          ${account.pfp}, ${account.verifiedAt}, ${account.address}, 
          ${account.number}, ${account.chainId}, ${account.chainType}, 
          ${account.connectorType}, ${account.recoveryMethod}, 
          ${account.walletClient}, ${account.walletClientType}
        )
      `;
    }

    // Insert MFA methods
    for (const method of mfaMethods) {
      await Bun.sql`
        INSERT INTO mfa_methods (user_id, method)
        VALUES (${id}, ${method})
      `;
    }

    return id;
  } catch (error) {
    console.error(`Failed to create user with details or return existing user:`, error);
    throw error;
  }
}

export async function updateUser(id: string, linkedAccounts?: any[], mfaMethods?: any[], hasAcceptedTerms?: boolean, verified?: boolean, updatedAt?: string | Date) {
  try {
    // Check if user exists
    const existingUser = await Bun.sql`
      SELECT * FROM users WHERE id = ${id} LIMIT 1
    `.values();

    if (existingUser.length === 0) {
      return false;
    }

    // Update user
    const now = new Date().toISOString();
    const result = await Bun.sql`
      UPDATE users 
      SET verified = ${verified}, 
          updated_at = ${now}
      WHERE id = ${id}
      RETURNING verified
    `.values();

    return result[0]?.verified ?? false;

  } catch (error) {
    console.error('Failed to update the user:', error);
    throw error;
  }
}

export async function suspendUser(id: string) {
  try {
    // Check if user exists
    const existingUser = await Bun.sql`
      SELECT * FROM users WHERE id = ${id} LIMIT 1
    `.values();

    if (existingUser.length === 0) {
      return false;
    }

    // Suspend user by updating suspended status and timestamp
    const now = new Date().toISOString();
    const result = await Bun.sql`
      UPDATE users 
      SET suspended = true, 
          suspended_at = ${now},
          updated_at = ${now}
      WHERE id = ${id}
      RETURNING suspended
    `.values();

    return result[0]?.suspended ?? false;

  } catch (error) {
    console.error('Failed to suspend the user:', error);
    throw error;
  }
}

export async function deleteUserAccount(id: string) {
  try {
    // Check if user exists
    const existingUser = await Bun.sql`
      SELECT * FROM users WHERE id = ${id} LIMIT 1
    `.values();

    if (existingUser.length === 0) {
      return false;
    }

    // Delete associated records first
    await Bun.sql`DELETE FROM linked_accounts WHERE user_id = ${id}`;
    await Bun.sql`DELETE FROM mfa_methods WHERE user_id = ${id}`;
    await Bun.sql`DELETE FROM user_wallets WHERE user_id = ${id}`;
    await Bun.sql`DELETE FROM emails WHERE user_id = ${id}`;

    // Finally delete the user
    const result = await Bun.sql`
      DELETE FROM users 
      WHERE id = ${id}
      RETURNING id
    `.values();

    return result[0]?.id ? true : false;

  } catch (error) {
    console.error('Failed to delete the user account:', error);
    throw error;
  }
}