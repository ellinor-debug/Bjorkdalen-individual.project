-- Creates every table the app uses. Run this first in the Neon SQL Editor
-- on an empty database, then run trails.sql.

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  username      TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,            -- only the hash is stored, never the password
  role          TEXT NOT NULL DEFAULT 'member',  -- 'member' or 'admin'
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS posts (
  id         SERIAL PRIMARY KEY,
  slug       TEXT UNIQUE NOT NULL,        -- used in the URL, e.g. /posts/alvstigen
  title      TEXT NOT NULL,
  body       TEXT NOT NULL,
  summary    TEXT,
  type       TEXT NOT NULL DEFAULT 'trail',  -- 'trail', 'update' or 'question'
  difficulty TEXT,                        -- trails only: 'very-easy' to 'extreme'
  length_km  NUMERIC,                     -- trails only
  author_id  INTEGER REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS comments (
  id         SERIAL PRIMARY KEY,
  post_id    INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id    INTEGER REFERENCES users(id),
  name       TEXT NOT NULL,
  body       TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body       TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
