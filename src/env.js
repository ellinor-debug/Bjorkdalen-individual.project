import { defineEnvVars } from '@sveltejs/kit/env';

// Keep DATABASE_URL private and read it dynamically from the deployment environment.
export const variables = defineEnvVars({
  DATABASE_URL: {
    static: false,
    schema: (value) => value
  },
  SESSION_SECRET: {
    static: false,
    schema: (value) => value
  },
  OPENROUTER_API_KEY: {
    static: false,
    schema: (value) => value
  }
});
