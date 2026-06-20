import path from 'node:path';
import { config } from 'dotenv';
import postgres from 'postgres';

function getConnectionString() {
  return process.env.POSTGRES_URL?.trim() || process.env.POSTGRES_PRISMA_URL?.trim();
}

function loadLocalDatabaseEnv() {
  if (getConnectionString() || process.env.NODE_ENV === 'production') {
    return;
  }

  config({
    path: ['.env.local', '.env'].map((file) =>
      path.resolve(process.cwd(), file),
    ),
    quiet: true,
  });
}

loadLocalDatabaseEnv();

const rawConnectionString = getConnectionString();

if (!rawConnectionString) {
  throw new Error(
    'Missing POSTGRES_URL. Create .env.local from .env.example and add your database connection string.',
  );
}

// Remove `channel_binding=require` — it is a Neon-specific hint that the
// `postgres` npm package does not recognise and causes a connection error.
// Handle three cases:
//   1. It is the only param:  ?channel_binding=require           → remove ?channel_binding=require
//   2. It is the first param: ?channel_binding=require&next=...  → replace with ?
//   3. It is a later param:   &channel_binding=require           → remove &channel_binding=require
const connectionString = rawConnectionString
  .replace(/\?channel_binding=require&/gi, '?')   // first param, more follow
  .replace(/[&?]channel_binding=require/gi, '');  // only param or trailing param

const sql = postgres(connectionString, { ssl: 'require' });

export default sql;
