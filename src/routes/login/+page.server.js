import { fail, redirect } from '@sveltejs/kit';
import { getDatabase } from '../../lib/server/db.js';
import {
  createSession,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE,
  verifyPassword
} from '../../lib/server/auth.js';

/** @param {string | null} value */
function safeReturnTo(value) {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) {
    return '/';
  }

  const parsed = new URL(value, 'https://park.local');
  return parsed.origin === 'https://park.local'
    ? `${parsed.pathname}${parsed.search}${parsed.hash}`
    : '/';
}

export function load({ locals, url }) {
  if (locals.user) redirect(303, safeReturnTo(url.searchParams.get('returnTo')));

  return { returnTo: safeReturnTo(url.searchParams.get('returnTo')) };
}

export const actions = {
  default: async ({ request, cookies, locals, url }) => {
    const formData = await request.formData();
    const returnTo = safeReturnTo(String(formData.get('returnTo') ?? url.searchParams.get('returnTo')));
    if (locals.user) redirect(303, returnTo);

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

    redirect(303, returnTo);
  }
};
