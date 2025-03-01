import jwt from "jsonwebtoken";
import { verifyKey } from "@sekmet/unkey-api";
import { getEnvVariable } from "@elizaos/core";

// Middleware for token verification
const authenticateToken = (req: any, res: any, next: any) => {
    const secretKey = getEnvVariable("JWT_SECRET");
    if (!secretKey) {
        return res.status(500).send("Internal server error");
    }
    const authHeader = req.headers["authorization"] as string;
    //console.log({authHeader});
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).send("Not authorized");

    jwt.verify(token, secretKey, async (err, credentials) => {
      if (err) return res.status(403).send('Invalid or expired token');
      //console.log(credentials)

      const { result: validation, error: keyError } = await verifyKey(credentials?.apikey);

      //console.log(validation?.result, keyError)

      if (keyError || !validation?.result?.valid) {
         return res.status(403).send('Invalid or expired api-key');
      }

      next();
    });

};

export default authenticateToken;
