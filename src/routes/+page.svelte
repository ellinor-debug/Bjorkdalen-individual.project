<script>
  import AuthControls from '../lib/components/AuthControls.svelte';

  let { data } = $props();

  /** @param {string} body */
  function trailDetails(body) {
    const [firstLine, ...rest] = body.split('\n');
    const match = firstLine.match(/^Length:\s*(.+?)\s*·\s*Difficulty:\s*(Easy|Medium|Hard)$/);

    return {
      length: match?.[1] ?? null,
      difficulty: match?.[2] ?? null
    };
  }
</script>

<svelte:head>
  <title>Björkdalen National Park — Trails in Dalarna</title>
  <meta
    name="description"
    content="Explore forest paths, river walks and mountain views in Björkdalen National Park, Dalarna."
  />
</svelte:head>

<div class="page-shell">
  <header class="topbar">
    <a class="brand" href="/" aria-label="Björkdalen National Park home">
      <span class="brand-mark" aria-hidden="true">B</span>
      <span>Björkdalen <span class="brand-light">National Park</span></span>
    </a>
    <nav class="nav" aria-label="Main navigation">
      <a href="/">Home</a>
      <a href="#trails">Trails</a>
      <div class="auth-controls"><AuthControls user={data.user} /></div>
    </nav>
  </header>

  <main>
    <section class="hero">
      <p class="eyebrow">Dalarna · Sweden</p>
      <h1>Find your quiet in the wild.</h1>
      <p class="lede">
        Wander through birch woodland, follow the river and climb above the valley.
        Björkdalen’s trails invite you to slow down and explore.
      </p>
      <a class="primary" href="#trails">Explore the trails <span aria-hidden="true">↓</span></a>
      <p class="hero-note">Leave only footprints. Take only good memories.</p>
    </section>

    <section id="trails" class="trails" aria-labelledby="trails-title">
      <div class="section-head">
        <p class="eyebrow">Choose your path</p>
        <h2 id="trails-title">Trails</h2>
        <p class="section-intro">From an easy lakeside loop to a rewarding summit climb.</p>
      </div>

      <div class="trail-grid">
        {#each data.posts as post (post.slug)}
          {@const details = trailDetails(post.body)}
          <article class="trail-card">
            <p class="meta">Björkdalen National Park</p>
            <h3><a href={`/posts/${post.slug}`}>{post.title}</a></h3>
            <p class="excerpt">{post.summary}</p>
            <div class="trail-footer">
              <div class="trail-facts">
                {#if details.length}
                  <span>{details.length}</span>
                {/if}
                {#if details.difficulty}
                  <span class={`difficulty ${details.difficulty.toLowerCase()}`}>
                    {details.difficulty}
                  </span>
                {/if}
              </div>
              <a class="read-link" href={`/posts/${post.slug}`}>
                Trail details <span aria-hidden="true">→</span>
              </a>
            </div>
          </article>
        {/each}
      </div>
    </section>
  </main>

  <footer>
    <p>Björkdalen National Park · Dalarna, Sweden</p>
    <p>Respect nature and help keep the trails wild.</p>
  </footer>
</div>

<style>
  :global(*) {
    box-sizing: border-box;
  }

  :global(body) {
    margin: 0;
    background: #f5f4ec;
    color: #23372a;
    font-family: Inter, 'Segoe UI', sans-serif;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  a:focus-visible {
    outline: 3px solid #718a55;
    outline-offset: 4px;
  }

  .page-shell {
    max-width: 1100px;
    margin: 0 auto;
    padding: 28px 28px 36px;
  }

  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 8px 0 24px;
    border-bottom: 1px solid #d8d8c9;
  }

  .brand {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-weight: 750;
    letter-spacing: 0.01em;
  }

  .brand-mark {
    display: grid;
    width: 34px;
    height: 34px;
    place-items: center;
    border-radius: 50%;
    background: #355b3d;
    color: white;
  }

  .brand-light {
    color: #657160;
    font-weight: 500;
  }

  .nav {
    display: flex;
    align-items: center;
    gap: 24px;
    color: #4a5a4b;
    font-size: 0.95rem;
  }

  .nav > a:hover {
    color: #2f633a;
  }

  .hero {
    max-width: 760px;
    padding: 78px 0 82px;
  }

  .eyebrow,
  .meta {
    color: #507446;
    font-size: 0.78rem;
    font-weight: 750;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .eyebrow {
    margin: 0 0 16px;
  }

  h1,
  h2,
  h3,
  p {
    margin-top: 0;
  }

  h1 {
    max-width: 700px;
    margin-bottom: 20px;
    font-family: Georgia, 'Times New Roman', serif;
    font-size: clamp(2.8rem, 7vw, 5.5rem);
    font-weight: 500;
    letter-spacing: -0.055em;
    line-height: 0.99;
  }

  .lede {
    max-width: 620px;
    margin-bottom: 28px;
    color: #536052;
    font-size: 1.12rem;
    line-height: 1.75;
  }

  .primary {
    display: inline-flex;
    min-height: 46px;
    align-items: center;
    gap: 12px;
    padding: 0 20px;
    border-radius: 999px;
    background: #355b3d;
    color: white;
    font-weight: 650;
  }

  .primary:hover {
    background: #284b31;
  }

  .hero-note {
    margin: 16px 0 0;
    color: #777a67;
    font-size: 0.9rem;
    font-style: italic;
  }

  .trails {
    padding-top: 32px;
    border-top: 1px solid #d8d8c9;
  }

  .section-head {
    margin-bottom: 24px;
  }

  .section-head .eyebrow {
    margin-bottom: 8px;
  }

  h2 {
    margin-bottom: 8px;
    font-family: Georgia, 'Times New Roman', serif;
    font-size: clamp(2rem, 4vw, 2.9rem);
    font-weight: 500;
    letter-spacing: -0.04em;
  }

  .section-intro {
    margin-bottom: 0;
    color: #64705f;
  }

  .trail-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 18px;
  }

  .trail-card {
    display: flex;
    min-height: 250px;
    flex-direction: column;
    padding: 22px;
    border: 1px solid #dedecf;
    border-radius: 18px;
    background: #fffef9;
  }

  .meta {
    margin-bottom: 13px;
    font-size: 0.68rem;
    letter-spacing: 0.08em;
  }

  h3 {
    margin-bottom: 10px;
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 1.55rem;
    font-weight: 600;
    letter-spacing: -0.025em;
    line-height: 1.2;
  }

  h3 a:hover,
  .read-link:hover {
    color: #507446;
  }

  .excerpt {
    margin-bottom: 22px;
    color: #596456;
    line-height: 1.65;
  }

  .trail-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-top: auto;
    font-size: 0.84rem;
  }

  .trail-facts {
    display: flex;
    align-items: center;
    gap: 9px;
    color: #536052;
  }

  .difficulty {
    padding: 4px 9px;
    border-radius: 999px;
    font-size: 0.74rem;
    font-weight: 700;
  }

  .difficulty.easy {
    background: #e0efdc;
    color: #2d6937;
  }

  .difficulty.medium {
    background: #fae9cf;
    color: #92500b;
  }

  .difficulty.hard {
    background: #f4dddd;
    color: #a3312c;
  }

  .read-link {
    color: #355b3d;
    font-weight: 650;
    white-space: nowrap;
  }

  footer {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    margin-top: 48px;
    padding-top: 20px;
    border-top: 1px solid #d8d8c9;
    color: #657160;
    font-size: 0.85rem;
  }

  footer p {
    margin-bottom: 0;
  }

  @media (max-width: 760px) {
    .page-shell {
      padding: 20px 18px 28px;
    }

    .hero {
      padding: 54px 0 58px;
    }

    .trail-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 520px) {
    .topbar {
      align-items: flex-start;
      flex-direction: column;
    }

    .nav {
      flex-wrap: wrap;
      gap: 14px;
    }

    .trail-grid {
      grid-template-columns: 1fr;
    }

    .trail-card {
      min-height: unset;
    }

    footer {
      flex-direction: column;
    }
  }
</style>
