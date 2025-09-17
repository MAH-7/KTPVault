import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { usersIc } from '@shared/schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Create the postgres client
const client = postgres(process.env.DATABASE_URL);

// Create the drizzle instance
export const db = drizzle(client, {
  schema: { usersIc }
});

export type Database = typeof db;