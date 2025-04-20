import { readFromDb, writeToDb } from './db';

export async function testDatabaseConnection() {
  try {
    // First, let's see what tables exist
    console.log('Checking database structure...');
    const tables = await readFromDb(`
      SELECT table_name, column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position;
    `);

    console.log('Database structure:', tables);
    return { success: true, schema: tables };
  } catch (error) {
    console.error('Database inspection failed:', error);
    return { success: false, error: error.message };
  }
}
