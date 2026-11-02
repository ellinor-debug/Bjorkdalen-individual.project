import { error, fail, redirect } from '@sveltejs/kit';
import { getDatabase } from '../../../lib/server/db.js';

export async function load({ params, locals }) {
  const sql = getDatabase();
  const [post] = await sql`
    SELECT posts.id, posts.slug, posts.title, posts.body, posts.created_at,
      users.username AS author
    FROM posts
    JOIN users ON users.id = posts.user_id
    WHERE posts.slug = ${params.slug}
      AND posts.type = 'community'
    LIMIT 1
  `;

  if (!post) error(404, 'Community post not found');

  const replies = await sql`
    SELECT COALESCE(users.username, comments.name) AS author, comments.body, comments.created_at
    FROM comments
    LEFT JOIN users ON users.id = comments.user_id
    WHERE comments.post_id = ${post.id}
    ORDER BY comments.created_at ASC
  `;

  return { post, replies, user: locals.user };
}

export const actions = {
  reply: async ({ request, params, locals }) => {
    if (!locals.user) {
      return fail(401, { error: 'Sign in to reply to a community post.' });
    }

    const formData = await request.formData();
    const body = String(formData.get('body') ?? '').trim();
    if (!body || body.length > 5000) {
      return fail(400, { error: 'Enter a reply of up to 5,000 characters.', body });
    }

    const sql = getDatabase();
    const [post] = await sql`
      SELECT id
      FROM posts
      WHERE slug = ${params.slug}
        AND type = 'community'
      LIMIT 1
    `;

    if (!post) error(404, 'Community post not found');

    await sql`
      INSERT INTO comments (post_id, user_id, name, body)
      VALUES (${post.id}, ${locals.user.id}, ${locals.user.username}, ${body})
    `;

    redirect(303, `/community/${params.slug}`);
  }
};
