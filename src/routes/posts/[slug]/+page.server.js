import { error, fail, redirect } from '@sveltejs/kit';
import { getDatabase } from '../../../lib/server/db.js';

// Find a trail and its visitor tips by slug.
export async function load({ params }) {
  const sql = getDatabase();
  const [post] = await sql`
    SELECT id, slug, title, body, summary, created_at
    FROM posts
    WHERE slug = ${params.slug}
    LIMIT 1
  `;

  if (!post) {
    error(404, 'Trail not found');
  }

  const comments = await sql`
    SELECT name, body, created_at
    FROM comments
    WHERE post_id = ${post.id}
    ORDER BY created_at DESC
  `;

  return { post, comments };
}

export const actions = {
  addComment: async ({ request, params }) => {
    const formData = await request.formData();
    const name = String(formData.get('name') ?? '').trim();
    const body = String(formData.get('body') ?? '').trim();

    if (!name || !body) {
      return fail(400, {
        error: 'Please enter your name and a tip or question.',
        name,
        body
      });
    }

    const sql = getDatabase();
    const [post] = await sql`
      SELECT id
      FROM posts
      WHERE slug = ${params.slug}
      LIMIT 1
    `;

    if (!post) {
      error(404, 'Trail not found');
    }

    await sql`
      INSERT INTO comments (post_id, name, body)
      VALUES (${post.id}, ${name}, ${body})
    `;

    redirect(303, `/posts/${params.slug}#tips`);
  }
};
