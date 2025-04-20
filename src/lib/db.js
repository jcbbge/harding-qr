import { neon } from '@neondatabase/serverless';

// Initialize the SQL client
const sql = neon(process.env.POSTGRES_URL);

// Example functions - modify these based on your needs
export async function readFromDb(query, params = []) {
  try {
    return await sql.raw(query, params);
  } catch (error) {
    console.error('Database read error:', error);
    throw error;
  }
}

export async function writeToDb(query, params = []) {
  try {
    return await sql.raw(query, params);
  } catch (error) {
    console.error('Database write error:', error);
    throw error;
  }
}

// Usage examples:
/*
// Read example
const users = await readFromDb('SELECT * FROM users WHERE id = $1', [123]);

// Write example
await writeToDb(
  'INSERT INTO users (name, email) VALUES ($1, $2)',
  ['John', 'john@example.com']
);

// Or use tagged templates
const userId = 123;
const user = await sql`SELECT * FROM users WHERE id = ${userId}`;
*/
