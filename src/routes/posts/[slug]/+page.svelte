<script>
  // Svelte 5 props receive the article selected by the route's load function.
  let { data } = $props();
</script>

<svelte:head>
  <title>{data.post.title} — Prompt &amp; Practice</title>
  <meta name="description" content={data.post.excerpt} />
</svelte:head>

<div class="page-shell">
  <header class="topbar">
    <a class="brand" href="/" aria-label="Prompt and Practice home">
      <span class="brand-mark">P</span>
      <span>Prompt &amp; Practice</span>
    </a>
    <a class="back-link" href="/">← All articles</a>
  </header>

  <main>
    <article class="article">
      <a class="back-link mobile-back" href="/">← Back to all articles</a>
      <p class="meta">{data.post.category} · {data.post.readTime}</p>
      <h1>{data.post.title}</h1>
      <p class="excerpt">{data.post.excerpt}</p>
      <time datetime={data.post.date}>
        {new Date(`${data.post.date}T12:00:00`).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })}
      </time>

      <div class="article-body">
        {#each data.post.content as paragraph}
          <p>{paragraph}</p>
        {/each}
      </div>

      <a class="back-link end-link" href="/">← Back to all articles</a>
    </article>
  </main>
</div>

<style>
  :global(*) {
    box-sizing: border-box;
  }

  :global(body) {
    margin: 0;
    background: #f7f6f2;
    color: #242a24;
    font-family: Inter, 'Segoe UI', sans-serif;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  a:focus-visible {
    outline: 3px solid #54785c;
    outline-offset: 4px;
  }

  .page-shell {
    max-width: 1100px;
    margin: 0 auto;
    padding: 28px 28px 48px;
  }

  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 8px 0 24px;
    border-bottom: 1px solid #dfded7;
  }

  .brand {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-weight: 700;
  }

  .brand-mark {
    display: grid;
    width: 32px;
    height: 32px;
    place-items: center;
    border-radius: 50%;
    background: #54785c;
    color: white;
  }

  .back-link {
    color: #3e6047;
    font-weight: 650;
  }

  .back-link:hover {
    text-decoration: underline;
    text-underline-offset: 4px;
  }

  .article {
    max-width: 700px;
    margin: 0 auto;
    padding: 64px 0 24px;
  }

  .mobile-back {
    display: none;
  }

  .meta {
    margin: 0 0 16px;
    color: #54785c;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  h1 {
    margin: 0 0 18px;
    font-size: clamp(2.5rem, 6vw, 4.5rem);
    letter-spacing: -0.06em;
    line-height: 1;
  }

  .excerpt {
    margin: 0 0 16px;
    color: #555d55;
    font-size: 1.2rem;
    line-height: 1.65;
  }

  time {
    color: #62685f;
    font-size: 0.9rem;
  }

  .article-body {
    margin-top: 40px;
    border-top: 1px solid #dfded7;
    padding-top: 24px;
  }

  .article-body p {
    margin: 0 0 22px;
    font-size: 1.08rem;
    line-height: 1.85;
  }

  .end-link {
    display: inline-block;
    margin-top: 16px;
  }

  @media (max-width: 600px) {
    .page-shell {
      padding: 20px 18px 32px;
    }

    .topbar > .back-link {
      display: none;
    }

    .mobile-back {
      display: inline-block;
      margin-bottom: 32px;
    }

    .article {
      padding-top: 36px;
    }
  }
</style>
