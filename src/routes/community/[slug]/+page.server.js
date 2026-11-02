import { error, fail, redirect } from '@sveltejs/kit';
import { getDatabase } from '../../../lib/server/db.js';
import { requireAdmin } from '../../../lib/server/auth.js';

export async function load({ params, locals }) {
  const sql = getDatabase();
  const [post] = await sql`
    SELECT posts.id, posts.slug, posts.title, posts.body, posts.created_at,
      posts.type, users.username AS author, users.role
    FROM posts
    JOIN users ON users.id = posts.author_id
    WHERE posts.slug = ${params.slug}
      AND posts.type IN ('update', 'question')
    LIMIT 1
  `;

  if (!post) error(404, 'Community post not found');

  const comments = await sql`
    SELECT comments.id, comments.body, comments.created_at,
      users.username AS author, users.role
    FROM comments
    JOIN users ON users.id = comments.user_id
    WHERE comments.post_id = ${post.id}
    ORDER BY comments.created_at ASC
  `;

  return { post, comments, user: locals.user };
}

export const actions = {
  comment: async ({ request, params, locals }) => {
    const sql = getDatabase();
    const [post] = await sql`
      SELECT id, type
      FROM posts
      WHERE slug = ${params.slug}
        AND posts.type IN ('update', 'question')
      LIMIT 1
    `;

    if (!post) error(404, 'Community post not found');

    const user = post.type === 'question' ? requireAdmin(locals) : locals.user;
    if (!user) {
      return fail(401, { error: 'Sign in to take part.' });
    }

    const formData = await request.formData();
    const body = String(formData.get('body') ?? '').trim();
    if (!body || body.length > 5000) {
      return fail(400, { error: 'Enter a comment of up to 5,000 characters.', body });
    }

    await sql`
      INSERT INTO comments (post_id, user_id, name, body)
      VALUES (${post.id}, ${user.id}, ${user.username}, ${body})
    `;

    redirect(303, `/community/${params.slug}#comments`);
  },

  deleteComment: async ({ request, params, locals }) => {
    requireAdmin(locals);
    const formData = await request.formData();
    const commentId = String(formData.get('commentId') ?? '');
    if (!commentId) return fail(400, { error: 'Comment not found.' });

    const sql = getDatabase();
    const [deleted] = await sql`
      DELETE FROM comments
      WHERE id = ${commentId}
        AND post_id = (
          SELECT id FROM posts
          WHERE slug = ${params.slug} AND type IN ('update', 'question')
        )
      RETURNING id
    `;
    if (!deleted) error(404, 'Comment not found.');
    redirect(303, `/community/${params.slug}#comments`);
  },

  deleteQuestion: async ({ params, locals }) => {
    requireAdmin(locals);
    const sql = getDatabase();
    const [deleted] = await sql`
      WITH deleted_comments AS (
        DELETE FROM comments
        WHERE post_id = (SELECT id FROM posts WHERE slug = ${params.slug} AND type = 'question')
        RETURNING id
      )
      DELETE FROM posts
      WHERE slug = ${params.slug}
        AND type = 'question'
        AND (SELECT count(*) FROM deleted_comments) >= 0
      RETURNING id
    `;
    if (!deleted) error(404, 'Question not found.');
    redirect(303, '/community#questions');
  },

  editUpdate: async ({ request, params, locals }) => {
    requireAdmin(locals);
    const formData = await request.formData();
    const title = String(formData.get('title') ?? '').trim();
    const body = String(formData.get('body') ?? '').trim();
    if (!title || title.length > 160 || !body || body.length > 10000) {
      return fail(400, { error: 'Enter a title (up to 160 characters) and update text (up to 10,000 characters).' });
    }

    const sql = getDatabase();
    const [updated] = await sql`
      UPDATE posts
      SET title = ${title}, body = ${body}, summary = ${body.slice(0, 240)}
      WHERE slug = ${params.slug} AND type = 'update'
      RETURNING id
    `;
    if (!updated) error(404, 'Park update not found.');
    redirect(303, `/community/${params.slug}`);
  },

  deleteUpdate: async ({ params, locals }) => {
    requireAdmin(locals);
    const sql = getDatabase();
    const [deleted] = await sql`
      WITH deleted_comments AS (
        DELETE FROM comments
        WHERE post_id = (SELECT id FROM posts WHERE slug = ${params.slug} AND type = 'update')
        RETURNING id
      )
      DELETE FROM posts
      WHERE slug = ${params.slug}
        AND type = 'update'
        AND (SELECT count(*) FROM deleted_comments) >= 0
      RETURNING id
    `;
    if (!deleted) error(404, 'Park update not found.');
    redirect(303, '/community#updates');
  }
};
