import * as dotenv from "dotenv";
import { SQL } from "bun";
dotenv.config();

export const db = new SQL({
    url:`postgres://${process.env.PGUSERNAME}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`,
    maxLifetime: 0,
    idleTimeout: 30,
    max: 20, // Maximum 20 concurrent connections
    // Callbacks
    onconnect: (client:any) => {
        console.log("Connected to database", client);
    },
    onclose: (client:any) => {
        console.log("Connection closed", client);
    },

});