import * as dotenv from "dotenv";
import { SQL } from "bun";
dotenv.config();

export const db = new SQL(`postgres://${process.env.PGUSERNAME}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`);