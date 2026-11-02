import { error } from '@sveltejs/kit';
import { getDatabase } from '../../../lib/server/db.js';

// Find an article by its URL slug; parameterized values are safe to use in SQL.
export async function load({ params }) {
  const sql = getDatabase();
  const [post] = await sql`
    SELECT slug, title, body, summary, created_at
    FROM posts
    WHERE slug = ${params.slug}
    LIMIT 1
  `;

  if (!post) {
    error(404, 'Article not found');
  }

  return { post };
}
