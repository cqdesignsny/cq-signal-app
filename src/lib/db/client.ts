import "server-only";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Run `vercel env pull .env.local` or set it in the Vercel project environment.",
  );
}

const sql = neon(connectionString);

export const db = drizzle(sql, { schema });

export * as schema from "./schema";
