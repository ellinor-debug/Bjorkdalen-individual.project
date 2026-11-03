# Björkdalen National Park – individual project, Programming & Methods (ACE2627), Berghs

Björkdalen National Park is a website for a fictional national park in Dalarna, Sweden. It brings
together trail information, the local weather forecast and a community where visitors and park staff
can share updates, questions and hiking tips.

## Features

- Browse eight fictional trails, with individual trail pages, lengths, difficulty ratings and practical information.
- Filter trails by one or more difficulty levels; selected filters are stored in the URL and can be shared.
- View the local SMHI weather forecast, with day/night icons and sunrise and sunset markers.
- Sign up, sign in and sign out.
- Read park updates, ask questions and take part in the hiker chat.
- Add comments and trail tips, stored in the Neon PostgreSQL database.
- Admin tools to post, edit and delete park updates, answer questions, moderate community content and review activity on the admin page.
- Generate an AI draft for a park update from a short outline; an admin reviews and edits it before publishing.

## Tech stack

- SvelteKit with Svelte 5
- PostgreSQL hosted by Neon
- SMHI Open Data API (`snow1g` point forecast)
- OpenRouter for AI-assisted update drafts
- SunCalc for sunrise and sunset calculations

## Park weather forecast

The front page requests SMHI's point forecast from the server at
`https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1/geotype/point/lon/14.20/lat/60.95/data.json`.
The coordinates identify the park; the forecast is fetched in `src/routes/+page.server.js`.

The JSON response contains a `timeSeries` array. Each entry has a `time` timestamp and a flat
`data` object containing fields such as `air_temperature`, `wind_speed`,
`precipitation_amount_mean`, and `symbol_code` (weather symbol code 1-27). Values of `9999` mean
missing data and are ignored. For each of today and the next three days (using the Stockholm time
zone), today's nearest forecast temperature and the upcoming 24 hours are shown with weather icons
and short descriptions. The horizontal timeline includes every available forecast entry in the
upcoming 24 hours; the next three days show their minimum and maximum temperatures. Symbol codes
map to inline SVG weather icons. Since SMHI's `symbol_code` does not indicate day or night,
SunCalc calculates local sunrise and sunset for each forecast time and the timeline marks those
transitions.

If the request fails or the response is unusable, the page displays a friendly unavailable message
instead of failing to render.

## Login and roles

Passwords are hashed before they are stored. After a successful sign-in, the server creates a
signed session token in an HTTP-only, secure, same-site cookie. The cookie expires after seven days.
The server validates the token and looks up the current user and role in the database on requests.

**Members** can read community content, ask questions, comment on park updates, use the hiker chat
and share trail tips. They cannot answer questions, publish or manage park updates, or use the admin
page and moderation controls.

**Admins (park staff)** can publish, edit and delete park updates, answer questions, moderate
questions, comments, answers and chat messages, and use the admin dashboard. Admins cannot ask
community questions.

Permissions are checked on the server for every protected action. Hiding a form or button in the
browser is not used as the security check.

## AI feature

Park staff can enter a short outline and ask the AI assistant to draft a title and update text.
OpenRouter is sent the outline and instructions to return JSON containing `title` and `body`. The
free models are tried in this order, with fallback if the first is busy:

1. `nvidia/nemotron-3.5-super-vl:free`
2. `google/gemma-4-26b-a4b-it:free`

The assistant does not publish anything. An admin must review and edit the draft and submit it
separately. Do not send personal, confidential or otherwise private information to free models.

## Intentionally left out

- Image and file uploads
- Real-time chat updates; the feed refreshes when the page reloads
- Password reset
- Email verification
- Real park, trail, facility and visitor information; all park and trail data is fictional
- A public admin-role management interface; an admin role is assigned directly in the database

## Running the project

### Prerequisites

- Node.js 20.19 or newer (or a newer supported major version)
- A Neon account and PostgreSQL database
- An OpenRouter API key for the AI draft feature

Install dependencies, create a local environment file, and start the development server:

```sh
npm install
cp .env.example .env
npm run dev
```

Fill in the values in `.env` before using the database-backed pages or AI draft feature. Set up the
database as described below before starting the site.

## Deploying to Vercel

The project uses the SvelteKit Vercel adapter. To deploy it:

1. Push the project to a Git provider supported by Vercel.
2. In Vercel, choose **Add New Project** and import the repository. Vercel should detect SvelteKit;
   leave the framework preset, install command (`npm install`) and build command (`npm run build`)
   at their detected defaults. Do not set a static output directory.
3. In the project's Vercel settings, add `DATABASE_URL`, `SESSION_SECRET` and
   `OPENROUTER_API_KEY` under **Environment Variables** for the environments you intend to use
   (Production, and Preview if needed). Use the actual private values there; do not put them in
   source files or commit them.
4. Ensure the Neon database already has the required tables and data. Apply `scripts/trails.sql`
   after provisioning the base schema, then deploy or redeploy the project.
5. Open the Vercel deployment URL and check the home page, sign-in, trails and community pages.
   The AI draft feature also requires a valid OpenRouter key.

Vercel builds the app as serverless functions plus static assets. Neon is accessed from server-side
code using its serverless driver; database and AI credentials are not sent to the browser. The
repository does not include SQL to create the full base schema, so an empty Neon database is not
ready for deployment until that schema has been provisioned.

## Database set-up

The repository contains one SQL file and one helper script in `scripts/`:

1. Provision the base database schema in Neon first. The schema setup itself is not included as a
   SQL file in this repository; the application expects the `users`, `posts`, `comments` and
   `messages` tables, along with the columns used by the app.
2. To create a user, run `node scripts/create-user.js` in a terminal after configuring the required
   environment variables. The script securely prompts for a username and password, hashes the
   password, and prints an `INSERT` statement. Run that generated SQL in the Neon SQL editor. This
   helper is JavaScript, not a SQL file.
3. Run [`scripts/trails.sql`](./scripts/trails.sql) in the Neon SQL editor. It updates the three
   existing trails with difficulty and length, then inserts or updates the five additional trails.
   The original trail rows must already exist before running this file.

To grant an existing user the admin role, run this statement in the Neon SQL editor, replacing the
placeholder with that user's username:

```sql
UPDATE users SET role = 'admin' WHERE username = '…';
```

New users have the database's default member role. The app reads the role from the database, so
role changes take effect on subsequent requests.

## Environment variables

Copy `.env.example` to `.env` and set these server-side values:

```dotenv
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require
SESSION_SECRET=replace-with-at-least-32-random-characters
OPENROUTER_API_KEY=your-openrouter-key
```

These are placeholders, not working credentials. Use the connection string supplied by Neon and a
long, random session secret. Keep `.env` private and **never commit it**. The OpenRouter key is used
only by the server and must not be exposed in browser code.

## Presentation

[Presentation slides](./presentation/) — the slides will be added to this folder later.
