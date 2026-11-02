<script>
  import { goto } from '$app/navigation';
  import WeatherIcon from '../lib/components/WeatherIcon.svelte';

  let { data } = $props();

  const difficultyLevels = [
    { value: 'very-easy', label: 'Very easy' },
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
    { value: 'extreme', label: 'Extremely difficult' }
  ];
  /** @type {string[]} */
  let selectedDifficulties = $state([]);
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

  /** @param {string} difficulty */
  function toggleDifficulty(difficulty) {
    selectedDifficulties = selectedDifficulties.includes(difficulty)
      ? selectedDifficulties.filter((value) => value !== difficulty)
      : [...selectedDifficulties, difficulty];
  }

  async function showTrails() {
    const selected = difficultyLevels
      .filter(({ value }) => selectedDifficulties.includes(value))
      .map(({ value }) => value);
    const query = selected.length ? `?difficulty=${selected.join(',')}` : '';
    await goto(`/trails${query}`);
  }
</script>

<svelte:head>
  <title>Björkdalen National Park — Dalarna, Sweden</title>
  <meta name="description" content="Find your quiet in the forests, river paths and hills of Björkdalen National Park." />
</svelte:head>

<main class="page-content">
  <section class="top-section" aria-label="Park welcome and today's weather">
    <div class="welcome">
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
          <h2 id="weather-title">Weather</h2>
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
      <h2 id="trails-title">Trails</h2>
      <p class="difficulty-hint">Choose one or more difficulty levels to find your kind of adventure.</p>
    </div>
    <div class="difficulty-grid" aria-label="Select trail difficulty">
      {#each difficultyLevels as level (level.value)}
        <button
          class={`difficulty-box ${level.value}`}
          class:selected={selectedDifficulties.includes(level.value)}
          type="button"
          aria-pressed={selectedDifficulties.includes(level.value)}
          onclick={() => toggleDifficulty(level.value)}
        >
          <strong>{level.label}</strong>
          <span>{data.posts.filter((post) => post.difficulty === level.value).length} trails</span>
        </button>
      {/each}
    </div>
    <button class="show-trails" type="button" onclick={showTrails}>Show trails <span aria-hidden="true">→</span></button>
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

  .weather {
    min-width: 0;
    display: flex;
    flex-direction: column;
    padding: 20px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: transparent;
    box-shadow: none;
  }

  .section-title {
    margin-bottom: 12px;
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
    justify-content: space-between;
    margin-top: 4px;
    margin-bottom: 0;
  }

  .timeline-heading::after {
    display: none;
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

  .hourly-forecast::after {
    display: none;
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

  .difficulty-grid {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 12px;
  }

  .difficulty-box {
    display: flex;
    min-width: 0;
    min-height: 112px;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 7px;
    border: 2px solid transparent;
    border-radius: 16px;
    padding: 16px;
    cursor: pointer;
    font: inherit;
    text-align: left;
    transition:
      transform 160ms ease,
      box-shadow 160ms ease;
  }

  .difficulty-box:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 24px var(--color-shadow);
  }

  .difficulty-box:focus-visible {
    outline: 3px solid var(--color-focus);
    outline-offset: 4px;
  }

  .difficulty-box.selected {
    border-color: var(--color-heading);
    box-shadow: 0 0 0 2px var(--color-page), 0 0 0 4px var(--color-heading);
  }

  .difficulty-box strong {
    font-size: 1.05rem;
    line-height: 1.25;
  }

  .difficulty-box span {
    font-size: 0.95rem;
    opacity: 0.9;
  }

  .difficulty-box.very-easy {
    background: var(--color-very-easy-bg);
    color: var(--color-very-easy-text);
  }

  .difficulty-box.easy {
    background: var(--color-easy-bg);
    color: var(--color-easy-text);
  }

  .difficulty-box.medium {
    background: var(--color-medium-bg);
    color: var(--color-medium-text);
  }

  .difficulty-box.hard {
    background: var(--color-hard-bg);
    color: var(--color-hard-text);
  }

  .difficulty-box.extreme {
    background: var(--color-extreme-bg);
    color: var(--color-extreme-text);
  }

  .difficulty-hint {
    margin: 8px 0 0;
    color: var(--color-text-muted);
  }

  .show-trails {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    margin-top: 18px;
    border: 0;
    border-radius: 999px;
    padding: 12px 20px;
    background: var(--color-accent);
    color: var(--color-white);
    cursor: pointer;
    font: inherit;
    font-weight: 700;
  }

  .show-trails:hover {
    background: var(--color-accent-hover);
  }

  .show-trails:focus-visible {
    outline: 3px solid var(--color-focus);
    outline-offset: 3px;
  }

  .show-trails span {
    font-size: 1.15rem;
    line-height: 1;
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

    .difficulty-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .difficulty-box:last-child {
      grid-column: 1 / -1;
    }
  }

  @media (max-width: 520px) {
    .page-content {
      padding-right: 16px;
      padding-left: 16px;
    }

    .weather {
      padding: 16px;
    }

    .hourly-forecast {
      justify-content: flex-start;
      min-height: 80px;
      gap: 18px;
      overscroll-behavior-x: contain;
      -webkit-overflow-scrolling: touch;
    }

    .timeline-heading::after {
      color: var(--color-text-muted);
      content: 'Swipe to see more →';
      font-size: 0.75rem;
    }

    .trails {
      margin-top: 32px;
    }

    .daily-forecast {
      gap: 6px;
    }

    .daily-icon {
      font-size: 34px;
    }

    .daily {
      gap: 3px;
      padding: 7px 3px;
      font-size: 0.82rem;
    }

    .daily strong {
      gap: 4px;
      font-size: 0.85rem;
    }

    .difficulty-box {
      min-height: 94px;
      padding: 12px;
    }

    .difficulty-box:last-child {
      grid-column: auto;
    }

    .difficulty-box strong {
      font-size: 0.98rem;
    }

    .difficulty-box span {
      font-size: 0.9rem;
    }
  }

  @media (max-width: 460px) {
    .weather {
      padding: 16px;
    }

    .weather-heading {
      align-items: center;
      flex-wrap: wrap;
      gap: 8px 12px;
    }

    .current-weather {
      gap: 5px;
      margin-right: 0;
      margin-left: auto;
    }

    .current-icon {
      font-size: 52px;
    }

    .current-description {
      max-width: 120px;
      font-size: 0.78rem;
    }

    .current-temperature {
      font-size: 1.7rem;
    }

    .current-temperature span {
      font-size: 0.9rem;
    }

    h2 {
      font-size: 1.25rem;
    }

  }
</style>
