<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { trailPracticalInfo } from '../../lib/trail-practical-info.js';

  let { data } = $props();

  const difficultyLevels = [
    { value: 'very-easy', label: 'Very easy' },
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
    { value: 'extreme', label: 'Extremely difficult' }
  ];
  const validDifficulties = difficultyLevels.map(({ value }) => value);

  const selectedDifficulties = $derived(
    [...new Set((page.url.searchParams.get('difficulty') ?? '')
      .split(',')
      .filter((value) => validDifficulties.includes(value)))]
  );
  const filteredTrails = $derived(
    selectedDifficulties.length
      ? data.trails.filter((trail) => selectedDifficulties.includes(trail.difficulty))
      : data.trails
  );

  /** @param {string} difficulty */
  async function toggleDifficulty(difficulty) {
    const selected = selectedDifficulties.includes(difficulty)
      ? selectedDifficulties.filter((value) => value !== difficulty)
      : [...selectedDifficulties, difficulty];
    const ordered = difficultyLevels
      .filter(({ value }) => selected.includes(value))
      .map(({ value }) => value);
    await goto(ordered.length ? `/trails?difficulty=${ordered.join(',')}` : '/trails');
  }

  async function clearFilters() {
    await goto('/trails');
  }

  /** @param {string} difficulty */
  function difficultyLabel(difficulty) {
    return difficultyLevels.find((level) => level.value === difficulty)?.label ?? difficulty;
  }

  /** @param {string | null} summary @param {string | null} body */
  function trailDescription(summary, body) {
    const text = summary || body || '';
    return text.replace(/^Length:\s*.+?\s*·\s*Difficulty:\s*.+\r?\n?/i, '').trim();
  }

  /** @param {number | string | null} length */
  function formatLength(length) {
    return length === null ? '—' : `${Number(length)} km`;
  }

  /** @param {string} slug */
  function trailInfo(slug) {
    return trailPracticalInfo[/** @type {keyof typeof trailPracticalInfo} */ (slug)];
  }
</script>

<svelte:head>
  <title>Trails — Björkdalen National Park</title>
  <meta name="description" content="Explore all eight Björkdalen trails and filter by difficulty." />
</svelte:head>

<main class="content">
  <header class="page-heading">
    <h1>Trails</h1>
    <p>Find a path that suits your day, from an accessible lakeside boardwalk to a demanding ridge route.</p>
    <p class="example-note">Times, elevation gains and trail colours are examples. Confirm details with park staff or on-site signs.</p>
  </header>

  <section class="filters" aria-label="Filter trails by difficulty">
    <div class="filter-heading">
      <h2>Difficulty</h2>
      <button class="clear-filter" type="button" onclick={clearFilters}>All</button>
    </div>
    <div class="filter-options">
      {#each difficultyLevels as level (level.value)}
        <button
          type="button"
          class={`filter-button ${level.value}`}
          class:selected={selectedDifficulties.includes(level.value)}
          aria-pressed={selectedDifficulties.includes(level.value)}
          onclick={() => toggleDifficulty(level.value)}
        >{level.label}</button>
      {/each}
    </div>
  </section>

  <p class="results-count" aria-live="polite">
    Showing {filteredTrails.length} {filteredTrails.length === 1 ? 'trail' : 'trails'}
  </p>

  {#if filteredTrails.length}
    <div class="trail-grid">
      {#each filteredTrails as trail (trail.slug)}
        {@const info = trailInfo(trail.slug)}
        <a class="trail-card" href={`/posts/${trail.slug}`}>
          <div class="card-heading">
            <h2>{trail.title}</h2>
            <span class={`difficulty ${trail.difficulty}`}>{difficultyLabel(trail.difficulty)}</span>
          </div>
          <dl class="trail-facts">
            <div><dt>Length</dt><dd>{formatLength(trail.length_km)}</dd></div>
            <div><dt>Time</dt><dd>{info?.time ?? 'Check locally'}</dd></div>
            <div><dt>Elevation gain</dt><dd>{info?.elevation ?? 'Check locally'}</dd></div>
            <div><dt>Trail marking</dt><dd>{info?.marking ?? 'Check trail signs'}</dd></div>
          </dl>
          <p class="description">{trailDescription(trail.summary, trail.body)}</p>
        </a>
      {/each}
    </div>
  {:else}
    <p class="empty-state">No trails match those difficulty levels.</p>
  {/if}
</main>

<style>
  .content {
    width: min(100% - 48px, 1400px);
    margin: 0 auto;
    padding: 48px 0 76px;
  }

  .page-heading {
    max-width: 760px;
    margin-bottom: 30px;
  }

  h1,
  h2 {
    color: var(--color-heading);
    font-family: Georgia, 'Times New Roman', serif;
    font-weight: 500;
    letter-spacing: -0.035em;
    line-height: 1.15;
  }

  h1 {
    margin: 0 0 12px;
    font-size: clamp(2.4rem, 5vw, 3.7rem);
  }

  .page-heading > p:last-child {
    margin: 0;
    color: var(--color-text-muted);
    font-size: 1.1rem;
  }

  .page-heading .example-note {
    margin-top: 8px;
    font-size: 0.9rem;
  }

  .filters {
    padding: 20px;
    border: 1px solid var(--color-border);
    border-radius: 16px;
    background: var(--color-surface);
  }

  .filter-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 12px;
  }

  .filter-heading h2 {
    margin: 0;
    font-size: 1.35rem;
  }

  .filter-options {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .filter-button,
  .clear-filter {
    min-height: 44px;
    border: 2px solid transparent;
    border-radius: 999px;
    padding: 8px 15px;
    cursor: pointer;
    font: inherit;
    font-weight: 700;
  }

  .filter-button.selected {
    border-color: currentColor;
    box-shadow: 0 0 0 2px var(--color-page);
  }

  .filter-button.very-easy,
  .difficulty.very-easy {
    background: var(--color-very-easy-bg);
    color: var(--color-very-easy-text);
  }

  .filter-button.easy,
  .difficulty.easy {
    background: var(--color-easy-bg);
    color: var(--color-easy-text);
  }

  .filter-button.medium,
  .difficulty.medium {
    background: var(--color-medium-bg);
    color: var(--color-medium-text);
  }

  .filter-button.hard,
  .difficulty.hard {
    background: var(--color-hard-bg);
    color: var(--color-hard-text);
  }

  .filter-button.extreme,
  .difficulty.extreme {
    background: var(--color-extreme-bg);
    color: var(--color-extreme-text);
  }

  .clear-filter {
    border-color: var(--color-border);
    background: transparent;
    color: var(--color-heading);
  }

  .filter-button:hover,
  .clear-filter:hover {
    filter: brightness(0.96);
  }

  .results-count {
    margin: 20px 0 12px;
    color: var(--color-text-muted);
    font-weight: 650;
  }

  .trail-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }

  .trail-card {
    display: flex;
    min-width: 0;
    flex-direction: column;
    padding: 18px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-surface);
    color: inherit;
    transition:
      border-color 160ms ease;
  }

  .trail-card:hover {
    border-color: var(--color-accent);
  }

  .card-heading {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  .card-heading h2 {
    margin: 0;
    font-size: clamp(1.35rem, 2vw, 1.7rem);
  }

  .difficulty {
    flex: 0 0 auto;
    border-radius: 999px;
    padding: 5px 10px;
    font-size: 0.82rem;
    font-weight: 700;
    line-height: 1.3;
  }

  .trail-facts {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px 14px;
    margin: 16px 0;
    padding: 12px 0;
    border-top: 1px solid var(--color-border);
    border-bottom: 1px solid var(--color-border);
  }

  .trail-facts div {
    min-width: 0;
  }

  .trail-facts dt {
    color: var(--color-text-muted);
    font-size: 0.84rem;
  }

  .trail-facts dd {
    margin: 0;
    color: var(--color-heading);
    font-weight: 650;
  }

  .description {
    margin: 0 0 18px;
    color: var(--color-text-muted);
    line-height: 1.55;
  }

  .empty-state {
    padding: 22px;
    border: 1px solid var(--color-border);
    border-radius: 14px;
    background: var(--color-surface);
    color: var(--color-text-muted);
  }

  @media (max-width: 900px) {
    .trail-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 600px) {
    .content {
      width: min(100% - 36px, 1400px);
      padding: 38px 0 56px;
    }

    .filters {
      padding: 16px;
    }

    .filter-options {
      flex-wrap: nowrap;
      overflow-x: auto;
      overscroll-behavior-x: contain;
      padding: 2px 2px 10px;
      scrollbar-color: var(--color-accent) var(--color-surface-muted);
      scrollbar-width: thin;
    }

    .filter-button {
      flex: 0 0 auto;
      padding-right: 14px;
      padding-left: 14px;
      font-size: 0.9rem;
      white-space: nowrap;
    }

    .trail-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
