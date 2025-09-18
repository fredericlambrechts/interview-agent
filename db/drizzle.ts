import { config } from "dotenv";
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

config({ path: ".env.local" });

// Create postgres client
const client = postgres(process.env.DATABASE_URL!);

// Create drizzle instance
export const db = drizzle(client);
