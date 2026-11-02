import { error, fail, redirect } from '@sveltejs/kit';
import { getDatabase } from '../../../lib/server/db.js';

// Find a trail and its visitor tips by slug.
export async function load({ params, locals }) {
  const sql = getDatabase();
  const [post] = await sql`
    SELECT id, slug, title, body, summary, created_at
    FROM posts
    WHERE slug = ${params.slug}
      AND type = 'trail'
    LIMIT 1
  `;

  if (!post) {
    error(404, 'Trail not found');
  }

  const comments = await sql`
    SELECT COALESCE(users.username, comments.name) AS username, comments.body, comments.created_at
    FROM comments
    LEFT JOIN users ON users.id = comments.user_id
    WHERE comments.post_id = ${post.id}
    ORDER BY comments.created_at DESC
  `;

  return { post, comments, user: locals.user };
};

export const actions = {
  addComment: async ({ request, params, locals }) => {
    if (!locals.user) {
      return fail(401, { error: 'Sign in to share a tip or question.' });
    }

    const formData = await request.formData();
    const body = String(formData.get('body') ?? '').trim();

    if (!body || body.length > 5000) {
      return fail(400, {
        error: 'Please enter a tip or question of up to 5,000 characters.',
        body
      });
    }

    const sql = getDatabase();
    const [post] = await sql`
      SELECT id
      FROM posts
      WHERE slug = ${params.slug}
        AND type = 'trail'
      LIMIT 1
    `;

    if (!post) {
      error(404, 'Trail not found');
    }

    await sql`
      INSERT INTO comments (post_id, user_id, name, body)
      VALUES (${post.id}, ${locals.user.id}, ${locals.user.username}, ${body})
    `;

    redirect(303, `/posts/${params.slug}#tips`);
  }
};
