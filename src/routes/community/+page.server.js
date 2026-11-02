import { getDatabase } from '../../lib/server/db.js';

export async function load() {
  const sql = getDatabase();
  const comments = await sql`
    SELECT comments.name, comments.body, comments.created_at, posts.title AS trail_title, posts.slug
    FROM comments
    JOIN posts ON posts.id = comments.post_id
    ORDER BY comments.created_at DESC
    LIMIT 30
  `;

  return { comments };
}
