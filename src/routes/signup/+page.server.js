import { fail, redirect } from '@sveltejs/kit';
import { getDatabase } from '../../lib/server/db.js';
import {
  createSession,
  hashPassword,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE
} from '../../lib/server/auth.js';

export function load({ locals }) {
  if (locals.user) redirect(303, '/');
}

export const actions = {
  default: async ({ request, cookies, locals }) => {
    if (locals.user) redirect(303, '/');

    const formData = await request.formData();
    const username = String(formData.get('username') ?? '').trim();
    const password = String(formData.get('password') ?? '');
    const confirmPassword = String(formData.get('confirmPassword') ?? '');

    if (!username || username.length > 100) {
      return fail(400, { error: 'Enter a username of up to 100 characters.', username });
    }

    if (password.length < 8 || password.length > 1024) {
      return fail(400, { error: 'Password must be at least 8 characters.', username });
    }

    if (password !== confirmPassword) {
      return fail(400, { error: 'Passwords do not match.', username });
    }

    const sql = getDatabase();
    const [existingUser] = await sql`
      SELECT id
      FROM users
      WHERE username = ${username}
      LIMIT 1
    `;

    if (existingUser) {
      return fail(400, { error: 'That username is already taken.', username });
    }

    const passwordHash = await hashPassword(password);
    let user;
    try {
      [user] = await sql`
        INSERT INTO users (username, password_hash)
        VALUES (${username}, ${passwordHash})
        RETURNING id, username
      `;
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === '23505'
      ) {
        return fail(400, { error: 'That username is already taken.', username });
      }

      throw error;
    }

    cookies.set(SESSION_COOKIE_NAME, createSession(user.id), {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE
    });

    redirect(303, '/');
  }
};
