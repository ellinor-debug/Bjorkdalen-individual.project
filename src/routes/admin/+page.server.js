import { error, fail, redirect } from '@sveltejs/kit';
import { getDatabase } from '../../lib/server/db.js';
import { requireAdmin } from '../../lib/server/auth.js';

export async function load({ locals }) {
  requireAdmin(locals, { redirectTo: '/' });
  const sql = getDatabase();
  const [counts, unansweredQuestions, activity] = await Promise.all([
    sql`
      SELECT
        (SELECT count(*)::int FROM users WHERE role = 'member') AS members,
        (SELECT count(*)::int FROM posts WHERE type = 'question') AS questions,
        (SELECT count(*)::int FROM posts
          WHERE type = 'question'
            AND NOT EXISTS (SELECT 1 FROM comments WHERE comments.post_id = posts.id)
        ) AS unanswered_questions,
        (SELECT count(*)::int FROM comments) AS comments,
        (SELECT count(*)::int FROM messages) AS messages
    `,
    sql`
      SELECT posts.id, posts.slug, posts.title, posts.created_at,
        users.username AS author, users.role
      FROM posts
      JOIN users ON users.id = posts.author_id
      WHERE posts.type = 'question'
        AND NOT EXISTS (SELECT 1 FROM comments WHERE comments.post_id = posts.id)
      ORDER BY posts.created_at DESC
    `,
    sql`
      SELECT *
      FROM (
        SELECT 'comment'::text AS kind, comments.id::text AS item_id,
          comments.body, comments.created_at, users.username AS author, users.role,
          CASE WHEN posts.type = 'trail'
            THEN '/posts/' || posts.slug || '#tips'
            ELSE '/community/' || posts.slug || '#comments'
          END AS href,
          posts.title AS context
        FROM comments
        JOIN users ON users.id = comments.user_id
        JOIN posts ON posts.id = comments.post_id
        UNION ALL
        SELECT 'message'::text AS kind, messages.id::text AS item_id,
          messages.body, messages.created_at, users.username AS author, users.role,
          '/community#chat' AS href, 'Hiker chat' AS context
        FROM messages
        JOIN users ON users.id = messages.user_id
      ) AS recent_activity
      ORDER BY created_at DESC
      LIMIT 20
    `
  ]);

  return { counts: counts[0], unansweredQuestions, activity };
}

export const actions = {
  deleteComment: async ({ request, locals }) => {
    requireAdmin(locals);
    const formData = await request.formData();
    const commentId = String(formData.get('commentId') ?? '');
    if (!commentId) return fail(400, { error: 'Comment not found.' });

    const sql = getDatabase();
    const [deleted] = await sql`DELETE FROM comments WHERE id = ${commentId} RETURNING id`;
    if (!deleted) error(404, 'Comment not found.');
    redirect(303, '/admin');
  },

  deleteMessage: async ({ request, locals }) => {
    requireAdmin(locals);
    const formData = await request.formData();
    const messageId = String(formData.get('messageId') ?? '');
    if (!messageId) return fail(400, { error: 'Message not found.' });

    const sql = getDatabase();
    const [deleted] = await sql`DELETE FROM messages WHERE id = ${messageId} RETURNING id`;
    if (!deleted) error(404, 'Message not found.');
    redirect(303, '/admin');
  },

  deleteQuestion: async ({ request, locals }) => {
    requireAdmin(locals);
    const formData = await request.formData();
    const slug = String(formData.get('slug') ?? '');
    if (!slug) return fail(400, { error: 'Question not found.' });

    const sql = getDatabase();
    const [deleted] = await sql`
      WITH deleted_comments AS (
        DELETE FROM comments
        WHERE post_id = (SELECT id FROM posts WHERE slug = ${slug} AND type = 'question')
        RETURNING id
      )
      DELETE FROM posts
      WHERE slug = ${slug}
        AND type = 'question'
        AND (SELECT count(*) FROM deleted_comments) >= 0
      RETURNING id
    `;
    if (!deleted) error(404, 'Question not found.');
    redirect(303, '/admin');
  }
};
