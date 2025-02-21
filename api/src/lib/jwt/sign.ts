import jwt from 'jsonwebtoken';

// Retrieve the JWT secret from the environment
const JWT_SECRET = process.env.JWT_AGENT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_AGENT_SECRET is not set');
}

export const signJwt = async (payload: any) => {
    if (!JWT_SECRET) {
        throw new Error('JWT_AGENT_SECRET is not set');
    }
    // Generate JWT token
    const token = jwt.sign(payload, JWT_SECRET);

    return token;
};