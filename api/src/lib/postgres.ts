import * as dotenv from "dotenv";
import { SQL } from "bun";
dotenv.config();

export const db = new SQL({
    url:`postgres://${process.env.PGUSERNAME}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`,
    max: 10, // Maximum 10 concurrent connections
    idleTimeout: 30, // Close idle connections after 30s
    maxLifetime: 3600, // Max connection lifetime 1 hour
    connectionTimeout: 10, // Connection timeout 10s
    // Callbacks
    onconnect: (client:any) => {
        console.log("Connected to database", client);
    },
    onclose: (client:any) => {
        console.log("Connection closed", client);
    },

});