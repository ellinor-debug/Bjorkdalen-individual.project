import { getDatabase } from '../lib/server/db.js';

// Read the trails on the server so database details stay private.
export async function load() {
  const sql = getDatabase();
  const posts = await sql`
    SELECT slug, title, summary, body, created_at
    FROM posts
    ORDER BY created_at DESC
  `;

  return { posts };
}
