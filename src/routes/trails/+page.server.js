import { getDatabase } from '../../lib/server/db.js';

export async function load() {
  const sql = getDatabase();
  const trails = await sql`
    SELECT slug, title, summary, body, difficulty, length_km
    FROM posts
    WHERE type = 'trail'
    ORDER BY length_km ASC, title ASC
  `;

  return { trails };
}
