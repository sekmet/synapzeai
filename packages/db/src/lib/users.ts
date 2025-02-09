export async function getUserById(id: string) {
    try {
        // Construct the SQL query
        // Only add set clauses for fields that are not empty
        const values: any[] = [];

        if (id !== undefined) {
          values.push(id);
        }

        // Count all existing entries
        const userProfile = await Bun.sql`
        SELECT users.*, emails.address AS email
        FROM users
        LEFT JOIN emails ON users.id = emails.user_id
        WHERE users.id = ${id}`.values();

        console.log("USER PROFILE", userProfile)

        const linkedAccounts = await Bun.sql`
        SELECT *
        FROM linked_accounts
        WHERE user_id = ${id}`.values();
        //LEFT JOIN linked_accounts ON users.id = linked_accounts.user_id

        console.log("LINKED ACCOUNTS", linkedAccounts)

        const wallets = Bun.sql`
        SELECT *
        FROM user_wallets
        WHERE user_id = ${id}`.values();
        //LEFT JOIN  ON users.id = user_wallets.user_id

        console.log("WALLETS", wallets)

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
          ...userProfile[0],
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