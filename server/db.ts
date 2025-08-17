import 'dotenv/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL must be set (dev-env.ts should set a fallback in development). If this appears in production, configure DATABASE_URL in the environment.'
  );
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Supabase requires SSL in most environments
  ssl: { rejectUnauthorized: false },
});

export const db = drizzle(pool, { schema });