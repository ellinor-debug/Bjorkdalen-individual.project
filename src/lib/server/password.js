import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);

/** @param {string} password */
export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = await scryptAsync(password, salt, 64);
  return `scrypt$${salt}$${derivedKey.toString('hex')}`;
}

/** @param {string} password @param {string} storedHash */
export async function verifyPassword(password, storedHash) {
  const [algorithm, salt, key, extra] = storedHash.split('$');
  if (
    algorithm !== 'scrypt' ||
    !/^[a-f0-9]{32}$/i.test(salt ?? '') ||
    !/^[a-f0-9]{128}$/i.test(key ?? '') ||
    extra !== undefined
  ) {
    return false;
  }

  const expected = Buffer.from(key, 'hex');
  const actual = await scryptAsync(password, salt, expected.length);
  return timingSafeEqual(expected, actual);
}
