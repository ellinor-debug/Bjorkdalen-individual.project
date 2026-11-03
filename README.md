# Björkdalen National Park

A website for a fictional national park in Dalarna, Sweden. Built for the individual project in
Programming & Methods (ACE2627) at Berghs.

Live site: [[VERCEL LINK](https://your-project.vercel.app)](https://bjorkdalen-individual-project-povi.vercel.app/)  

## Features

- Trail listings and individual trail pages.
- Difficulty filters saved in the URL.
- SMHI weather with day and night icons.
- Sign up, sign in and sign out.
- Community park updates, questions and hiker chat.
- Comments and tips stored in Neon.
- Admin tools for updates, answers, moderation and activity.
- AI-generated drafts for park updates.

## Tech stack

- SvelteKit with Svelte 5
- PostgreSQL on Neon
- SMHI Open Data API (`snow1g`)
- OpenRouter
- SunCalc
- Deployed on Vercel

## How the database works

The browser never connects to the database. Queries run on the server in `+page.server.js` files
through [`src/lib/server/db.js`](./src/lib/server/db.js), which reads `DATABASE_URL`.

The database has four tables:

- `users` — usernames, password hashes and roles.
- `posts` — trails, park updates and questions.
- `comments` — trail tips, update comments and question answers.
- `messages` — hiker chat messages.

User input is passed as separate values in the `sql` template. This keeps it separate from the SQL
query and helps protect against SQL injection.

## Weather (SMHI)

The server fetches SMHI's point forecast for the park at longitude 14.20 and latitude 60.95. The
`timeSeries` entries contain a `time` and flat `data` object; missing values (`9999`) are ignored.
SunCalc calculates sunrise and sunset because SMHI weather symbols do not indicate day or night.

Request URL:  
`https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1/geotype/point/lon/14.20/lat/60.95/data.json`

## Login and roles

Passwords are hashed. Sign-in creates a signed, HTTP-only session cookie that expires after seven
days.

**Members** can ask questions, comment on updates, use the chat and share trail tips. They cannot
answer questions or use admin tools. **Admins** can manage updates, answer questions, moderate
community content and use the admin page. Every permission is checked on the server.

## AI feature

Admins can ask OpenRouter to draft an update from a short outline. It tries
`nvidia/nemotron-3.5-super-vl:free` first, then falls back to
`google/gemma-4-26b-a4b-it:free`. An admin always reviews and edits the draft before publishing.
Do not send private information to free models.

## Intentionally left out

- Image and file uploads.
- Real-time chat; messages appear after the page reloads.
- Password reset and email verification.
- Real park or trail data; all park, trail and visitor information is fictional.
- A public admin-role management page; roles are set directly in the database.
- Some practical trail details (walking time, elevation, facilities) are stored in
  `src/lib/trail-practical-info.js` rather than in the database.

## Running the project locally

You need Node.js 20.19 or newer, a Neon account and an OpenRouter key.

```sh
npm install
cp .env.example .env
npm run dev
```

Add your private values to `.env` before using the database or AI feature.

## Database set-up

Run these steps in the Neon SQL Editor:

1. Run [`scripts/schema.sql`](./scripts/schema.sql) to create the tables.
2. Check [`scripts/trails.sql`](./scripts/trails.sql). It updates the existing trails
   `bjorkslingan`, `alvstigen` and `krakberget`, then inserts five more. The three original trails
   must already exist. If the database is empty, insert those trails first with a `slug`, `title`,
   `summary`, `body` and `type` of `'trail'`.
3. Create a user by running `node scripts/create-user.js` in a terminal. Enter a username and
   password when prompted, then run the SQL it prints in the Neon SQL Editor.
4. To make that user an admin, run this statement and replace the placeholder username:

   ```sql
   UPDATE users SET role = 'admin' WHERE username = '…';
   ```

## Environment variables

Copy `.env.example` to `.env` and set these values:

```dotenv
DATABASE_URL=your-neon-connection-string
SESSION_SECRET=replace-with-at-least-32-random-characters
OPENROUTER_API_KEY=your-openrouter-key
```

These are placeholders. **Never commit `.env`** or share its secrets.

## Deploying to Vercel

1. Import the repository into Vercel.
2. Keep the detected SvelteKit settings.
3. Add `DATABASE_URL`, `SESSION_SECRET` and `OPENROUTER_API_KEY` in Vercel's Environment Variables.
4. Deploy.
