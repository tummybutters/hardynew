import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@shared/schema";

// Create PostgreSQL connection with more reliable settings
const connectionString = process.env.DATABASE_URL || "";

// Log connection info (without exposing credentials)
console.log(`[database] Connecting to PostgreSQL database...`);

// Configure connection with retry logic and better error handling
const client = postgres(connectionString, { 
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
  max_lifetime: 60 * 30,
  prepare: false, // for better compatibility
  onnotice: () => {}, // suppress notice messages
  onparameter: () => {}, // suppress parameter messages
  debug: (conn, query, params, types) => {
    // Uncomment for query debugging if needed
    // console.log(`[database] Query: ${query}`);
  },
  connection: {
    // Additional connection settings
    application_name: "hardys_detailing_app"
  }
});

// Initialize Drizzle with our schema
export const db = drizzle(client, { schema });

// Test the connection
async function testConnection() {
  try {
    await client`SELECT 1`;
    console.log(`[database] Database connection successful`);
    return true;
  } catch (error) {
    console.error(`[database] Connection error:`, error);
    // Don't crash, return false
    return false;
  }
}

// Export helper for migrations (to be used with drizzle-kit)
export const migrationClient = client;

// Expose test function
export const testDatabaseConnection = testConnection;