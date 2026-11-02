import { getDatabase } from './lib/server/db.js';
import { readSession, SESSION_COOKIE_NAME } from './lib/server/auth.js';

export async function handle({ event, resolve }) {
  event.locals.user = null;
  const token = event.cookies.get(SESSION_COOKIE_NAME);

  if (token) {
    const userId = readSession(token);
    if (userId) {
      const sql = getDatabase();
      const [user] = await sql`
        SELECT id, username, role
        FROM users
        WHERE id = ${userId}
        LIMIT 1
      `;

      if (user) {
        event.locals.user = {
          id: String(user.id),
          username: user.username,
          role: user.role
        };
      } else {
        event.cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
      }
    } else {
      event.cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
    }
  }

  return resolve(event);
}
