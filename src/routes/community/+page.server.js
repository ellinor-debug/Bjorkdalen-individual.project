import { randomUUID } from 'node:crypto';
import { fail, redirect } from '@sveltejs/kit';
import { getDatabase } from '../../lib/server/db.js';

export async function load({ locals }) {
  const sql = getDatabase();
  const [posts, latestTips] = await Promise.all([
    sql`
      SELECT posts.slug, posts.title, posts.created_at, users.username AS author,
        COUNT(comments.id)::int AS reply_count
      FROM posts
      JOIN users ON users.id = posts.user_id
      LEFT JOIN comments ON comments.post_id = posts.id
      WHERE posts.type = 'community'
      GROUP BY posts.id, users.username
      ORDER BY posts.created_at DESC
      LIMIT 50
    `,
    sql`
      SELECT comments.body, comments.created_at,
        COALESCE(users.username, comments.name) AS author,
        posts.title AS trail_title, posts.slug
      FROM comments
      JOIN posts ON posts.id = comments.post_id
      LEFT JOIN users ON users.id = comments.user_id
      WHERE posts.type = 'trail'
      ORDER BY comments.created_at DESC
      LIMIT 10
    `
  ]);

  return { posts, latestTips, user: locals.user };
}

export const actions = {
  default: async ({ request, locals }) => {
    if (!locals.user) {
      return fail(401, { error: 'Sign in to start a community discussion.' });
    }

    const formData = await request.formData();
    const title = String(formData.get('title') ?? '').trim();
    const body = String(formData.get('body') ?? '').trim();

    if (!title || title.length > 160 || !body || body.length > 10000) {
      return fail(400, {
        error: 'Enter a title (up to 160 characters) and text (up to 10,000 characters).',
        title,
        body
      });
    }

    const slug = `discussion-${randomUUID()}`;
    const sql = getDatabase();
    await sql`
      INSERT INTO posts (slug, title, summary, body, type, user_id)
      VALUES (
        ${slug},
        ${title},
        ${body.slice(0, 240)},
        ${body},
        'community',
        ${locals.user.id}
      )
    `;

    redirect(303, `/community/${slug}`);
  }
};
