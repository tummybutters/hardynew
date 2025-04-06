import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@shared/schema";

// Create PostgreSQL connection with more reliable settings
const connectionString = process.env.DATABASE_URL || "";

// Log connection info (without exposing credentials)
console.log(`[database] Connecting to PostgreSQL database...`);

// Set up a connection pool with better error handling
const client = postgres(connectionString, { 
  max: 10,
  idle_timeout: 20,
  connect_timeout: 15, // Increased timeout
  max_lifetime: 60 * 30,
  prepare: false, // for better compatibility
  onnotice: () => {}, // suppress notice messages
  onparameter: () => {}, // suppress parameter messages
  
  // Use the debug option to add additional connection monitoring
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

/**
 * Test database connection with multiple retry attempts
 * This helps handle temporary network issues
 */
async function testConnection(retries = 3, delay = 500) {
  let lastError = null;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`[database] Connection attempt ${attempt}/${retries}...`);
      await client`SELECT 1`;
      console.log(`[database] Database connection successful on attempt ${attempt}`);
      return true;
    } catch (error: any) {
      lastError = error;
      console.error(`[database] Connection attempt ${attempt} failed:`, error.message || String(error));
      
      // Don't wait on the last attempt
      if (attempt < retries) {
        console.log(`[database] Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        // Increase delay for next attempt (exponential backoff)
        delay = Math.min(delay * 1.5, 5000); // Cap at 5 seconds
      }
    }
  }
  
  console.error(`[database] All connection attempts failed. Last error:`, lastError);
  return false;
}

// Export helper for migrations (to be used with drizzle-kit)
export const migrationClient = client;

// Expose test function
export const testDatabaseConnection = testConnection;