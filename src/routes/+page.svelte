<script>
  import WeatherIcon from '../lib/components/WeatherIcon.svelte';

  let { data } = $props();

  const trailNames = ['Björkslingan', 'Älvstigen', 'Kråkberget'];
  /** @type {Record<number, string>} */
  const weatherDescriptions = {
    1: 'Sunny',
    2: 'Mostly sunny',
    3: 'Variable cloud',
    4: 'Partly cloudy',
    5: 'Cloudy',
    6: 'Overcast',
    7: 'Fog',
    8: 'Light showers',
    9: 'Showers',
    10: 'Heavy showers',
    11: 'Thunderstorm',
    12: 'Light sleet showers',
    13: 'Sleet showers',
    14: 'Heavy sleet showers',
    15: 'Light snow showers',
    16: 'Snow showers',
    17: 'Heavy snow showers',
    18: 'Light rain',
    19: 'Rain',
    20: 'Heavy rain',
    21: 'Thunderstorm',
    22: 'Light sleet',
    23: 'Sleet',
    24: 'Heavy sleet',
    25: 'Light snow',
    26: 'Snow',
    27: 'Heavy snow'
  };

  /** @param {number | null} code */
  function weatherDescription(code) {
    return code === null ? 'Forecast unavailable' : weatherDescriptions[code] ?? 'Cloudy';
  }

  /** @param {string} value */
  const normalize = (value) => value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

  /** @param {string} body */
  function trailDetails(body) {
    const firstLine = body.split('\n')[0] ?? '';
    const match = firstLine.match(/^Length:\s*(.+?)\s*·\s*Difficulty:\s*(Easy|Medium|Hard)$/);
    return { length: match?.[1] ?? null, difficulty: match?.[2] ?? null };
  }

  const trails = $derived.by(() => {
    const selected = trailNames
      .map((name) => data.posts.find((post) => normalize(post.title) === normalize(name)))
      .filter((post) => post !== undefined);

    const remaining = data.posts.filter((post) => !selected.includes(post));
    return [...selected, ...remaining].slice(0, trailNames.length);
  });
</script>

<svelte:head>
  <title>Björkdalen National Park — Dalarna, Sweden</title>
  <meta name="description" content="Find your quiet in the forests, river paths and hills of Björkdalen National Park." />
</svelte:head>

<main class="page-content">
  <section class="top-section" aria-label="Park welcome and today's weather">
    <div class="welcome">
      <p class="eyebrow">Dalarna · Sweden</p>
      <h1>Welcome to Björkdalen</h1>
      <p>
        Welcome to Björkdalen National Park, where forest paths invite you to hike at your own pace.
        Settle into a quiet camping spot beside one of our clear lakes, and keep an eye out for elk,
        foxes and birds among the pines. With open hills, winding water and peaceful trails, there is
        something to discover in every season. The park is open all year, whenever you need a little
        time outdoors.
      </p>
    </div>
    <section class="weather panel" aria-labelledby="weather-title">
      <div class="weather-heading">
        <div class="weather-title-group">
          <p class="eyebrow">Plan a gentle day outdoors</p>
          <h2 id="weather-title">Weather in the park</h2>
        </div>
        {#if data.weather}
          <div class="current-weather">
            <span class="current-icon">
              <WeatherIcon
                symbolCode={data.weather.current?.symbolCode ?? null}
                isNight={data.weather.current?.isNight ?? false}
              />
            </span>
            <div class="current-details">
              <p class="current-temperature">
                {data.weather.current ? data.weather.current.temperature : '—'}<span>°C</span>
              </p>
              <p class="current-description">Today · {weatherDescription(data.weather.current?.symbolCode ?? null)}</p>
            </div>
          </div>
        {/if}
      </div>
      {#if data.weather}
        <div class="timeline-heading">
          <h3>Next 24 hours</h3>
        </div>
        <div class="hourly-forecast" aria-label="Forecast for the next 24 hours">
          {#each data.weather.timeline as entry (`${entry.type}-${entry.time}`)}
            {#if entry.type === 'sunrise' || entry.type === 'sunset'}
              <div class="sun-marker">{entry.label}</div>
            {:else}
              <div class="hour">
                <span>{entry.label}</span>
                <span class="hour-icon">
                  <WeatherIcon symbolCode={entry.symbolCode} isNight={entry.isNight} />
                </span>
                <strong>{entry.temperature === null ? '—' : `${entry.temperature}°`}</strong>
              </div>
            {/if}
          {/each}
          {#if data.weather.timeline.length === 0}
            <p class="no-hours">No upcoming forecast times available.</p>
          {/if}
        </div>
        <div class="daily-forecast" aria-label="Forecast for the next three days">
          {#each data.weather.days as day (day.date)}
            <div class="daily">
              <span>{day.label}</span>
              <span class="daily-icon">
                <WeatherIcon symbolCode={day.symbolCode} isNight={false} />
              </span>
              <strong><span class="high">{day.max === null ? '—' : `${day.max}°`}</span><span class="low">{day.min === null ? '—' : `${day.min}°`}</span></strong>
            </div>
          {/each}
        </div>
      {:else}
        <p class="weather-error">The park forecast is temporarily unavailable. Please try again later.</p>
      {/if}
    </section>
  </section>

  <section id="trails" class="trails" aria-labelledby="trails-title">
    <div class="section-title">
      <p class="eyebrow">Take the long way round</p>
      <h2 id="trails-title">Find your trail</h2>
    </div>
    <div class="trail-grid">
      {#each trails as post (post.slug)}
        {@const details = trailDetails(post.body)}
        <a class="trail-card" href={`/posts/${post.slug}`}>
          <p class="trail-label">Björkdalen National Park</p>
          <h3>{post.title}</h3>
          <p class="summary">{post.summary}</p>
          <div class="trail-facts">
            {#if details.length}<span>{details.length}</span>{/if}
            {#if details.difficulty}
              <span class={`difficulty ${details.difficulty.toLowerCase()}`}>{details.difficulty}</span>
            {/if}
          </div>
          <span class="trail-link">Explore trail <span aria-hidden="true">→</span></span>
        </a>
      {/each}
    </div>
  </section>
</main>

<style>
  .page-content {
    width: 100%;
    margin: 0;
    padding: 32px 4vw 0;
  }

  .top-section {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
    align-items: stretch;
    gap: 52px;
  }

  .welcome {
    align-self: start;
    padding: 0;
  }

  .welcome .eyebrow {
    font-size: 0.95rem;
  }

  .eyebrow,
  .trail-label {
    margin: 0 0 6px;
    color: var(--color-accent);
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  h1,
  h2,
  h3,
  p {
    margin-top: 0;
  }

  h1,
  h2 {
    color: var(--color-heading);
    font-family: Georgia, 'Times New Roman', serif;
    font-weight: 500;
    letter-spacing: -0.035em;
    line-height: 1.1;
  }

  h1 {
    margin-bottom: 14px;
    font-size: clamp(2.4rem, 4vw, 3.4rem);
  }

  .welcome > p:last-child {
    margin-bottom: 0;
    color: var(--color-text-muted);
    font-size: 1.15rem;
    line-height: 1.55;
  }

  .panel,
  .trail-card {
    border: 1px solid var(--color-border);
    border-radius: 18px;
    background: var(--color-surface);
  }

  .weather {
    min-width: 0;
    display: flex;
    flex-direction: column;
    padding: 20px;
  }

  .section-title {
    margin-bottom: 12px;
  }

  .section-title .eyebrow {
    margin-bottom: 4px;
  }

  h2 {
    margin-bottom: 0;
    font-size: clamp(1.35rem, 2vw, 1.75rem);
  }

  .weather-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 8px;
  }

  .weather-title-group {
    min-width: 0;
  }

  .current-weather {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    gap: 8px;
    margin-right: clamp(0px, 2vw, 24px);
  }

  .current-icon {
    font-size: 76px;
    line-height: 1;
  }

  .current-details {
    text-align: right;
  }

  .current-temperature {
    margin: 0;
    color: var(--color-heading);
    font-size: 2.3rem;
    font-weight: 650;
    line-height: 1.1;
  }

  .current-temperature span {
    font-size: 1rem;
    font-weight: 500;
  }

  .current-description {
    margin: 1px 0 0;
    color: var(--color-text-muted);
    font-size: 0.85rem;
  }

  .timeline-heading {
    display: flex;
    align-items: baseline;
    margin-top: 4px;
    margin-bottom: 0;
  }

  .timeline-heading h3 {
    margin: 0;
    color: var(--color-heading);
    font-size: 1rem;
  }

  .hourly-forecast {
    display: flex;
    min-width: 0;
    flex: 0 0 auto;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 24px;
    overflow-x: auto;
    padding: 5px 0 8px;
    scrollbar-color: var(--color-accent) var(--color-surface-muted);
    scrollbar-width: thin;
  }

  .hour {
    display: grid;
    min-width: 48px;
    justify-items: center;
    gap: 3px;
    color: var(--color-text-muted);
    font-size: 1rem;
    white-space: nowrap;
  }

  .hour-icon {
    font-size: 38px;
    line-height: 1.2;
  }

  .sun-marker {
    flex: 0 0 auto;
    align-self: center;
    padding: 5px 8px;
    border: 1px solid var(--color-border);
    border-radius: 999px;
    background: var(--color-surface-muted);
    color: var(--color-heading);
    font-size: 0.75rem;
    font-weight: 650;
    white-space: nowrap;
  }

  .daily-icon {
    font-size: 48px;
    line-height: 1.2;
  }

  .daily > span:first-child {
    font-weight: 700;
  }

  .hour strong,
  .daily strong {
    color: var(--color-heading);
    font-size: 1rem;
  }

  .hour strong {
    font-size: 1.125rem;
    font-weight: 700;
  }

  .no-hours {
    margin: 0;
    align-self: center;
    color: var(--color-text-muted);
    font-size: 0.85rem;
  }

  .daily-forecast {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
    margin-top: 6px;
    padding-top: 8px;
    border-top: 1px solid var(--color-border);
  }

  .daily {
    display: grid;
    min-width: 0;
    justify-items: center;
    gap: 5px;
    padding: 9px 8px;
    border: 1px solid var(--color-border);
    border-radius: 12px;
    background: var(--color-surface-muted);
    color: var(--color-text-muted);
    font-size: 1rem;
    text-align: center;
  }

  .daily strong {
    display: flex;
    gap: 8px;
    white-space: nowrap;
  }

  .daily strong .low {
    color: var(--color-text-muted);
    font-weight: 400;
  }

  .weather-error {
    margin: 0;
    color: var(--color-text-muted);
  }

  .trails {
    margin-top: 52px;
    padding-top: 20px;
    border-top: 1px solid var(--color-border);
  }

  .trails .section-title {
    margin-bottom: 10px;
  }

  .trails .section-title h2 {
    font-size: clamp(1.75rem, 2vw, 1.75rem);
  }

  .trail-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
  }

  .trail-card {
    display: flex;
    min-height: 180px;
    flex-direction: column;
    padding: 15px 17px;
    color: inherit;
    transition:
      transform 160ms ease,
      box-shadow 160ms ease,
      border-color 160ms ease;
  }

  .trail-card:hover {
    transform: translateY(-3px);
    border-color: var(--color-accent);
    box-shadow: 0 10px 24px var(--color-shadow);
  }

  .trail-card:focus-visible {
    outline: 3px solid var(--color-focus);
    outline-offset: 4px;
  }

  .trail-label {
    margin-bottom: 6px;
    font-size: 0.72rem;
  }

  .trail-card h3 {
    margin-bottom: 5px;
    color: var(--color-heading);
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 1.75rem;
    line-height: 1.15;
  }

  .summary {
    margin-bottom: 10px;
    color: var(--color-text-muted);
    font-size: 1.1rem;
    line-height: 1.45;
  }

  .trail-facts {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: auto;
    color: var(--color-text-muted);
    font-size: 1.05rem;
  }

  .difficulty {
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 1rem;
    font-weight: 700;
  }

  .difficulty.easy {
    background: var(--color-easy-bg);
    color: var(--color-easy-text);
  }

  .difficulty.medium {
    background: var(--color-medium-bg);
    color: var(--color-medium-text);
  }

  .difficulty.hard {
    background: var(--color-hard-bg);
    color: var(--color-hard-text);
  }

  .trail-link {
    align-self: flex-start;
    margin-top: 8px;
    font-size: 0.9rem;
    color: var(--color-accent);
    font-weight: 700;
  }

  @media (max-width: 760px) {
    .page-content {
      padding: 24px 18px 0;
    }

    .top-section {
      grid-template-columns: 1fr;
      gap: 24px;
    }

    .welcome {
      padding: 0;
    }

    .trail-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 520px) {
    .weather {
      padding: 18px;
    }

    .hourly-forecast {
      justify-content: flex-start;
      min-height: 80px;
    }

    .trails {
      margin-top: 32px;
    }

    .daily-forecast {
      gap: 8px;
    }
  }

  @media (max-width: 460px) {
    .weather {
      padding: 16px;
    }

    .weather-heading {
      align-items: flex-start;
      gap: 8px;
    }

    .current-temperature {
      font-size: 1.9rem;
    }

    .current-temperature span {
      font-size: 0.9rem;
    }

    h2 {
      font-size: 1.25rem;
    }

    .daily-forecast {
      gap: 5px;
    }

    .daily {
      padding: 10px 4px;
      font-size: 0.78rem;
    }

    .daily strong {
      gap: 5px;
      font-size: 0.9rem;
    }
  }
</style>
