import { fail, redirect } from '@sveltejs/kit';
import { getDatabase } from '../../lib/server/db.js';
import {
  createSession,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE,
  verifyPassword
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

    if (!username || username.length > 100 || !password || password.length > 1024) {
      return fail(400, { error: 'Enter a valid username and password.' });
    }

    const sql = getDatabase();
    const [user] = await sql`
      SELECT id, username, password_hash
      FROM users
      WHERE username = ${username}
      LIMIT 1
    `;

    if (!user || !(await verifyPassword(password, user.password_hash))) {
      return fail(400, { error: 'Incorrect username or password.' });
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
