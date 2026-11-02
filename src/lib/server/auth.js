import { SESSION_SECRET } from '$app/env/private';
import { createHmac, timingSafeEqual } from 'node:crypto';

export { hashPassword, verifyPassword } from './password.js';
export const SESSION_COOKIE_NAME = 'session';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function getSessionSecret() {
  if (!SESSION_SECRET || SESSION_SECRET.length < 32) {
    throw new Error('SESSION_SECRET must contain at least 32 characters.');
  }

  return SESSION_SECRET;
}

/** @param {string | number | bigint} userId */
export function createSession(userId) {
  const payload = Buffer.from(
    JSON.stringify({
      userId: String(userId),
      expiresAt: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE
    })
  ).toString('base64url');
  const signature = createHmac('sha256', getSessionSecret()).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

/** @param {string} token */
export function readSession(token) {
  const [payload, signature, extra] = token.split('.');
  if (!payload || !signature || extra !== undefined) return null;

  const expected = createHmac('sha256', getSessionSecret()).update(payload).digest();
  const actual = Buffer.from(signature, 'base64url');
  if (actual.length !== expected.length || !timingSafeEqual(expected, actual)) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (
      typeof data.userId !== 'string' ||
      !data.userId ||
      !Number.isInteger(data.expiresAt) ||
      data.expiresAt <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    return data.userId;
  } catch {
    return null;
  }
}
