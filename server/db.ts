import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { usersIc } from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Create the postgres client with SSL configuration for production
// Supabase requires SSL and uses connection pooling
const client = postgres(process.env.DATABASE_URL, {
  ssl: process.env.NODE_ENV === "production" ? "require" : false,
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
  prepare: false, // Required for Supabase connection pooler (port 6543)
});

// Create the drizzle instance
export const db = drizzle(client, {
  schema: { usersIc },
});

export type Database = typeof db;
