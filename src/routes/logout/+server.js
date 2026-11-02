import { redirect } from '@sveltejs/kit';
import { SESSION_COOKIE_NAME } from '../../lib/server/auth.js';

export function POST({ cookies }) {
  cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
  redirect(303, '/');
}
