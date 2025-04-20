import { testDatabaseConnection } from '../../lib/dbTest';

export async function GET() {
  const result = await testDatabaseConnection();

  return new Response(JSON.stringify(result), {
    headers: {
      'Content-Type': 'application/json'
    },
    status: result.success ? 200 : 500
  });
}
