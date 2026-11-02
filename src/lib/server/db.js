import { DATABASE_URL } from '$app/env/private';
import { neon } from '@neondatabase/serverless';

/** @type {import('@neondatabase/serverless').NeonQueryFunction<false, false> | undefined} */
let database;

// Create the Neon client only when a server load function needs it.
export function getDatabase() {
  if (!DATABASE_URL) {
    throw new Error('DATABASE_URL is missing. Add it to your local .env file.');
  }

  if (!database) {
    database = neon(DATABASE_URL);
  }

  return database;
}
