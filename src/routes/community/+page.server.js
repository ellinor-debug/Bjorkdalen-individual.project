const MODELS = ['nvidia/nemotron-3.5-super-vl:free', 'google/gemma-4-26b-a4b-it:free'];
const AI_BUSY_MESSAGE =
  'The AI assistant is busy right now – please try again in a minute, or write the update yourself';

import { randomUUID } from 'node:crypto';
import { error, fail, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { getDatabase } from '../../lib/server/db.js';
import { requireAdmin } from '../../lib/server/auth.js';

const UPDATE_SYSTEM_PROMPT =
  'You write short, friendly, factual park updates for Björkdalen National Park in British English. Write a short title and 2–4 sentences. Only use facts from the outline; don’t invent details.';

/**
 * Ask OpenRouter for a draft. The server sends the outline with auth headers,
 * the free-model fallback list, and system/user messages; the response content
 * is read from choices[0].message.content and parsed as { title, body } JSON.
 */
/** @param {string} outline */
async function writeUpdateDraft(outline) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      models: MODELS,
      messages: [
        { role: 'system', content: UPDATE_SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Return a JSON object with string fields "title" and "body".\n\nOutline:\n${outline}`
        }
      ]
    }),
    signal: AbortSignal.timeout(20_000)
  });

  if (!response.ok) {
    console.error(`OpenRouter draft request failed with HTTP ${response.status}.`);
    return null;
  }

  const result = await response.json();
  const content = result?.choices?.[0]?.message?.content;
  if (typeof content !== 'string' || !content.trim()) {
    console.error('OpenRouter returned no draft text.');
    return null;
  }

  try {
    const jsonContent = content.trim().replace(/^```(?:json)?\s*|\s*```$/g, '');
    const parsed = JSON.parse(jsonContent);
    if (typeof parsed.title === 'string' && typeof parsed.body === 'string') {
      return { title: parsed.title, body: parsed.body };
    }
  } catch {
    // Plain-text responses become the draft body; the admin supplies its title.
  }

  return { title: '', body: content.trim() };
}

export async function load({ locals }) {
  const sql = getDatabase();
  const [posts, messages] = await Promise.all([
    sql`
      SELECT posts.id, posts.slug, posts.title, posts.body, posts.created_at,
        posts.type, users.username AS author, users.role,
        COUNT(comments.id)::int AS comment_count
      FROM posts
      JOIN users ON users.id = posts.author_id
      LEFT JOIN comments ON comments.post_id = posts.id
      WHERE posts.type IN ('update', 'question')
      GROUP BY posts.id, users.username, users.role
      ORDER BY posts.created_at DESC
    `,
    sql`
      SELECT recent.id, recent.user_id, recent.body, recent.created_at, recent.username, recent.role
      FROM (
        SELECT messages.id, messages.user_id, messages.body, messages.created_at,
          users.username, users.role
        FROM messages
        JOIN users ON users.id = messages.user_id
        ORDER BY messages.created_at DESC
        LIMIT 50
      ) AS recent
      ORDER BY recent.created_at ASC
    `
  ]);

  return {
    updates: posts.filter((post) => post.type === 'update'),
    questions: posts.filter((post) => post.type === 'question'),
    messages,
    user: locals.user
  };
}

export const actions = {
  writeDraft: async ({ request, locals }) => {
    requireAdmin(locals);
    const formData = await request.formData();
    const outline = String(formData.get('outline') ?? '').trim();
    const title = String(formData.get('title') ?? '');
    const body = String(formData.get('body') ?? '');
    if (!outline || outline.length > 2000) {
      return fail(400, {
        formType: 'draft',
        error: 'Enter a short outline (up to 2,000 characters).',
        outline,
        title,
        body
      });
    }
    if (!env.OPENROUTER_API_KEY) {
      console.error('OPENROUTER_API_KEY is not configured.');
      return fail(503, { formType: 'draft', error: AI_BUSY_MESSAGE, outline, title, body });
    }

    try {
      const draft = await writeUpdateDraft(outline);
      if (!draft) {
        return fail(503, { formType: 'draft', error: AI_BUSY_MESSAGE, outline, title, body });
      }

      return { formType: 'draft', outline, title: draft.title, body: draft.body };
    } catch (cause) {
      console.error('OpenRouter draft request failed.', cause);
      return fail(503, { formType: 'draft', error: AI_BUSY_MESSAGE, outline, title, body });
    }
  },

  newUpdate: async ({ request, locals }) => {
    const user = requireAdmin(locals);

    const formData = await request.formData();
    const title = String(formData.get('title') ?? '').trim();
    const body = String(formData.get('body') ?? '').trim();
    if (!title || title.length > 160 || !body || body.length > 10000) {
      return fail(400, {
        error: 'Enter a title (up to 160 characters) and update text (up to 10,000 characters).',
        title,
        body,
        formType: 'update'
      });
    }

    const slug = `update-${randomUUID()}`;
    const sql = getDatabase();
    await sql`
      INSERT INTO posts (slug, title, summary, body, type, author_id)
      VALUES (${slug}, ${title}, ${body.slice(0, 240)}, ${body}, 'update', ${user.id})
    `;

    redirect(303, `/community/${slug}`);
  },

  askQuestion: async ({ request, locals }) => {
    if (!locals.user) {
      return fail(401, { error: 'Sign in to take part.' });
    }
    if (locals.user.role === 'admin') {
      error(403, 'Park staff cannot ask community questions.');
    }

    const formData = await request.formData();
    const title = String(formData.get('title') ?? '').trim();
    const body = String(formData.get('body') ?? '').trim();
    if (!title || title.length > 160 || !body || body.length > 10000) {
      return fail(400, {
        error: 'Enter a title (up to 160 characters) and question (up to 10,000 characters).',
        title,
        body,
        formType: 'question'
      });
    }

    const slug = `question-${randomUUID()}`;
    const sql = getDatabase();
    await sql`
      INSERT INTO posts (slug, title, summary, body, type, author_id)
      VALUES (${slug}, ${title}, ${body.slice(0, 240)}, ${body}, 'question', ${locals.user.id})
    `;

    redirect(303, `/community/${slug}`);
  },

  sendMessage: async ({ request, locals }) => {
    if (!locals.user) {
      return fail(401, { error: 'Sign in to take part.' });
    }

    const formData = await request.formData();
    const body = String(formData.get('body') ?? '').trim();
    if (!body || body.length > 500) {
      return fail(400, {
        error: 'Enter a message of up to 500 characters.',
        body,
        formType: 'message'
      });
    }

    const sql = getDatabase();
    await sql`
      INSERT INTO messages (user_id, body)
      VALUES (${locals.user.id}, ${body})
    `;

    redirect(303, '/community#chat');
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
    redirect(303, '/community#questions');
  },

  deleteMessage: async ({ request, locals }) => {
    requireAdmin(locals);
    const formData = await request.formData();
    const messageId = String(formData.get('messageId') ?? '');
    if (!messageId) return fail(400, { error: 'Message not found.' });

    const sql = getDatabase();
    const [deleted] = await sql`
      DELETE FROM messages
      WHERE id = ${messageId}
      RETURNING id
    `;

    if (!deleted) error(404, 'Message not found.');
    redirect(303, '/community#chat');
  }
};
