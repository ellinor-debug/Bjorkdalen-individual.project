# Individual-assignment

The site has a home page with the park forecast and trail cards, an `/about` page with
visitor information, and a `/community` page for community discussions and the latest
tips from the trails. Visitors can create an account at `/signup`, then sign in to
start discussions, reply, or share trail tips. Community posts have their own
`/community/[slug]` pages; trail tips remain on their respective `/posts/[slug]` pages.
The shared header, responsive navigation and editable theme colours
are in `src/routes/+layout.svelte`. The shared handwritten wordmark and decorative
watercolour landscape are also rendered from the layout; the illustration lives in
`src/lib/components/Landscape.svelte`.

The `/trails` page lists all trail posts and supports multi-select difficulty filters
stored in the `difficulty` query parameter (for example, `/trails?difficulty=easy,medium`).
The SQL to populate `difficulty` and `length_km` for all eight trails is in
[`scripts/trails.sql`](./scripts/trails.sql).

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