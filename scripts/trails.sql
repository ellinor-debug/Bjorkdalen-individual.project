BEGIN;

UPDATE posts
SET difficulty = trail_data.difficulty,
    length_km = trail_data.length_km
FROM (
  VALUES
    ('bjorkslingan', 'easy', 3.0::numeric),
    ('alvstigen', 'medium', 8.0::numeric),
    ('krakberget', 'hard', 14.0::numeric)
) AS trail_data(slug, difficulty, length_km)
WHERE posts.slug = trail_data.slug
  AND posts.type = 'trail';

INSERT INTO posts (slug, title, summary, body, type, difficulty, length_km)
VALUES
  (
    'sjostigen',
    'Sjöstigen',
    'An accessible boardwalk circles the lake through peaceful lakeside scenery. Suitable for wheelchairs and strollers.',
    'An accessible boardwalk circles the lake through peaceful lakeside scenery. Suitable for wheelchairs and strollers.',
    'trail',
    'very-easy',
    1.5
  ),
  (
    'myrleden',
    'Myrleden',
    'Follow a wooden boardwalk across an open bog, with wide views and changing light. It is an excellent route for birdwatching.',
    'Follow a wooden boardwalk across an open bog, with wide views and changing light. It is an excellent route for birdwatching.',
    'trail',
    'easy',
    4
  ),
  (
    'tjarnrundan',
    'Tjärnrundan',
    'This loop visits three small forest lakes beneath a quiet canopy of pines. A shelter along the way makes a welcoming spot for lunch.',
    'This loop visits three small forest lakes beneath a quiet canopy of pines. A shelter along the way makes a welcoming spot for lunch.',
    'trail',
    'medium',
    10
  ),
  (
    'granasleden',
    'Granåsleden',
    'A long ridge trail winds through old spruce forest and climbs several steep sections. Expect a demanding day among deep woods and open views.',
    'A long ridge trail winds through old spruce forest and climbs several steep sections. Expect a demanding day among deep woods and open views.',
    'trail',
    'hard',
    16
  ),
  (
    'fjallkammen',
    'Fjällkammen',
    'This full-day route follows the high ridge over rough, rocky ground. Scrambling and exposed sections make it suitable only for experienced hikers.',
    'This full-day route follows the high ridge over rough, rocky ground. Scrambling and exposed sections make it suitable only for experienced hikers.',
    'trail',
    'extreme',
    24
  )
ON CONFLICT (slug) DO UPDATE
SET title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    body = EXCLUDED.body,
    type = EXCLUDED.type,
    difficulty = EXCLUDED.difficulty,
    length_km = EXCLUDED.length_km;

COMMIT;
