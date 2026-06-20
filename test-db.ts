const path = require('node:path');
const { config } = require('dotenv');
const postgres = require('postgres');

config({
  path: ['.env.local', '.env'].map((file: string) =>
    path.resolve(process.cwd(), file),
  ),
  quiet: true,
});

const connectionString =
  process.env.POSTGRES_URL?.trim() || process.env.POSTGRES_PRISMA_URL?.trim();

if (!connectionString) {
  throw new Error('Missing POSTGRES_URL. Create .env.local from .env.example.');
}

const sql = postgres(connectionString, { ssl: 'require' });

async function testConnection() {
  try {
    console.log('Attempting to connect to Postgres...');
    const result = await sql`SELECT NOW()`;
    console.log('Connection successful.');
    console.log('Server current time:', result[0].now);
  } catch (error) {
    console.error('Connection failed.');
    console.error(error);
    process.exitCode = 1;
  } finally {
    await sql.end();
  }
}

testConnection();
