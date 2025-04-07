import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { documents, users } from '@shared/schema';

// Create a SQL connection if DATABASE_URL is available
let client: ReturnType<typeof postgres> | null = null;
let db: ReturnType<typeof drizzle> | null = null;

try {
  const connectionString = process.env.DATABASE_URL;
  if (connectionString) {
    client = postgres(connectionString);
    db = drizzle(client, { schema: { documents, users } });
  } else {
    console.log('[Database] No DATABASE_URL provided, using in-memory storage');
  }
} catch (error) {
  console.error('[Database] Error connecting to database:', error);
  console.log('[Database] Fallback to in-memory storage');
}

export { db };

// Initialize database by creating tables if they don't exist
export async function initializeDatabase() {
  // Skip database initialization if client is not available
  if (!client) {
    console.log('[Database] Skipping database initialization, using in-memory storage');
    return;
  }
  
  try {
    // Create users table if it doesn't exist
    await client`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      )
    `;

    // Create documents table if it doesn't exist
    await client`
      CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        file_name VARCHAR(255) NOT NULL,
        content_type VARCHAR(100) NOT NULL,
        file_size INTEGER NOT NULL,
        upload_date VARCHAR(100) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'uploaded',
        enhancement_enabled BOOLEAN DEFAULT TRUE,
        spell_check_enabled BOOLEAN DEFAULT TRUE,
        layout_analysis_enabled BOOLEAN DEFAULT TRUE,
        ocr_mode VARCHAR(20) DEFAULT 'auto',
        output_format VARCHAR(10) DEFAULT 'txt',
        confidence_threshold INTEGER DEFAULT 80,
        original_text TEXT,
        processed_text TEXT,
        processing_summary JSONB
      )
    `;

    console.log('[Database] Tables initialized successfully');
  } catch (error) {
    console.error('[Database] Error initializing tables:', error);
    console.log('[Database] Fallback to in-memory storage');
  }
}