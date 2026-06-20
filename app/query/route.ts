import sql from '../lib/db';

export async function GET() {
  try {
    const data = await sql`SELECT month, revenue, pg_typeof(revenue) as type FROM revenue LIMIT 3`;
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
