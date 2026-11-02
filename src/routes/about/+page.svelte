<svelte:head>
  <title>About the park — Björkdalen National Park</title>
  <meta name="description" content="Discover the forests, river paths and gentle hills of Björkdalen National Park in Dalarna." />
</svelte:head>

<main class="content">
  <p class="eyebrow">Dalarna · Sweden</p>
  <h1>A place to slow down</h1>
  <p class="intro">
    Björkdalen National Park is a quiet corner of Dalarna, shaped by northern forests,
    a winding river and rounded hills. It is a place to notice the small things and
    enjoy the outdoors at your own pace.
  </p>

  <section class="info-card">
    <h2>Explore gently</h2>
    <p>
      Walk beneath birch and pine, listen to the river, pause for a picnic or follow a
      trail up to a wide view over the valley. The three marked routes offer something
      for an easy afternoon as well as a longer day outside.
    </p>
  </section>

  <section class="info-card rules" aria-labelledby="rules-title">
    <h2 id="rules-title">Help care for the park</h2>
    <ul>
      <li>Keep dogs on a leash so wildlife and other visitors can feel at ease.</li>
      <li>Stay on marked paths and leave plants, stones and cultural sites undisturbed.</li>
      <li>Take all litter with you and use established picnic and fire areas only.</li>
      <li>Give wildlife plenty of space and enjoy watching from a distance.</li>
    </ul>
  </section>
</main>

<style>
  .content {
    max-width: 820px;
    margin: 0 auto;
    padding: 64px 28px 76px;
  }

  .eyebrow {
    margin: 0 0 10px;
    color: var(--color-accent);
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
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
    margin: 0 0 18px;
    font-size: clamp(2.5rem, 7vw, 4rem);
  }

  h2 {
    margin: 0 0 12px;
    font-size: 1.8rem;
  }

  .intro {
    margin: 0 0 30px;
    color: var(--color-text-muted);
    font-size: 1.15rem;
    line-height: 1.8;
  }

  .info-card {
    margin-top: 16px;
    padding: 24px;
    border: 1px solid var(--color-border);
    border-radius: 16px;
    background: var(--color-surface);
  }

  .info-card p,
  .info-card ul {
    margin-bottom: 0;
    color: var(--color-text);
    line-height: 1.8;
  }

  .info-card ul {
    display: grid;
    gap: 8px;
    padding-left: 22px;
  }

  @media (max-width: 600px) {
    .content {
      padding: 44px 18px 56px;
    }

    .info-card {
      padding: 20px;
    }
  }
</style>
