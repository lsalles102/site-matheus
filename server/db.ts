import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error(
    "SUPABASE_URL and SUPABASE_ANON_KEY must be set. Please configure your Supabase credentials.",
  );
}

// Create Supabase client
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// For Drizzle, we'll use the direct database connection
// Extract the project reference from Supabase URL
const projectRef = process.env.SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
if (!projectRef) {
  throw new Error("Invalid Supabase URL format");
}

// Build proper PostgreSQL connection string for Supabase
const connectionString = `postgres://postgres:[YOUR_PASSWORD]@db.${projectRef}.supabase.co:5432/postgres`;

// For now, we'll use Supabase client instead of direct Drizzle connection
// This approach uses Supabase's built-in security and works with RLS
export const db = supabase;