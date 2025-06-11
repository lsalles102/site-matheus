import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";

// Database connection
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Please configure your database connection."
  );
}

// Create postgres connection
const client = postgres(DATABASE_URL, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
  ssl: DATABASE_URL.includes('supabase') ? { rejectUnauthorized: false } : false
});

// Create drizzle database instance
export const db = drizzle(client, { schema });