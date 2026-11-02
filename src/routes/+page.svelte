<script>
  // Svelte 5 props receive the data returned by the route's load function.
  let { data } = $props();

  // Format the database timestamp as a date that is easy to read.
  /** @param {string | Date} date */
  function formatDate(date) {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
</script>

<svelte:head>
  <title>Prompt & Practice — AI tools for content creators</title>
  <meta
    name="description"
    content="A student's notes on using AI tools thoughtfully in the content creation process."
  />
</svelte:head>

<div class="page-shell">
  <header class="topbar">
    <a class="brand" href="/" aria-label="Prompt and Practice home">
      <span class="brand-mark">P</span>
      <span>Prompt &amp; Practice</span>
    </a>
    <nav class="nav" aria-label="Main navigation">
      <a href="/">Home</a>
      <a href="#articles">Articles</a>
    </nav>
  </header>

  <main>
    <section class="hero">
      <p class="eyebrow">AI tools for content creators</p>
      <h1>Making room for better ideas, one tool at a time.</h1>
      <p class="lede">
        I’m a programming and methods student exploring how AI can support thoughtful,
        useful content — without losing the human voice behind it.
      </p>
      <a class="primary" href="#articles">Explore the articles</a>
    </section>

    <section id="articles" class="articles" aria-labelledby="articles-title">
      <div class="section-head">
        <p class="eyebrow">The journal</p>
        <h2 id="articles-title">Latest articles</h2>
      </div>

      <div class="post-grid">
        {#each data.posts as post (post.slug)}
          <article class="post-card">
            <p class="meta">Article</p>
            <h3><a href={`/posts/${post.slug}`}>{post.title}</a></h3>
            <p class="excerpt">{post.summary}</p>
            <div class="article-footer">
              <time datetime={new Date(post.created_at).toISOString()}>
                {formatDate(post.created_at)}
              </time>
              <a class="read-link" href={`/posts/${post.slug}`}>
                Read article <span aria-hidden="true">→</span>
              </a>
            </div>
          </article>
        {/each}
      </div>
    </section>
  </main>

  <footer>
    <p>Prompt &amp; Practice · A learning journal about AI and content.</p>
  </footer>
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
    padding: 28px 28px 36px;
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
    letter-spacing: 0.01em;
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

  .nav {
    display: flex;
    gap: 24px;
    color: #4c554d;
    font-size: 0.95rem;
  }

  .hero {
    max-width: 740px;
    padding: 72px 0 76px;
  }

  .eyebrow,
  .meta {
    color: #54785c;
    font-size: 0.78rem;
    font-weight: 700;
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
    font-size: clamp(2.7rem, 7vw, 5.4rem);
    letter-spacing: -0.065em;
    line-height: 0.99;
  }

  .lede {
    max-width: 620px;
    margin-bottom: 28px;
    color: #555d55;
    font-size: 1.12rem;
    line-height: 1.75;
  }

  .primary {
    display: inline-flex;
    min-height: 46px;
    align-items: center;
    padding: 0 20px;
    border-radius: 999px;
    background: #54785c;
    color: white;
    font-weight: 650;
  }

  .primary:hover {
    background: #3e6047;
  }

  .articles {
    padding-top: 32px;
    border-top: 1px solid #dfded7;
  }

  .section-head {
    margin-bottom: 24px;
  }

  .section-head .eyebrow {
    margin-bottom: 8px;
  }

  h2 {
    margin-bottom: 0;
    font-size: clamp(1.9rem, 4vw, 2.8rem);
    letter-spacing: -0.05em;
  }

  .post-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 18px;
  }

  .post-card {
    display: flex;
    min-height: 250px;
    flex-direction: column;
    padding: 22px;
    border: 1px solid #e4e2d9;
    border-radius: 18px;
    background: #fffefa;
  }

  .meta {
    margin-bottom: 13px;
    font-size: 0.7rem;
    letter-spacing: 0.08em;
  }

  h3 {
    margin-bottom: 10px;
    font-size: 1.35rem;
    letter-spacing: -0.035em;
    line-height: 1.2;
  }

  h3 a:hover,
  .read-link:hover {
    color: #54785c;
  }

  .excerpt {
    margin-bottom: 22px;
    color: #555d55;
    line-height: 1.65;
  }

  .article-footer {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin-top: auto;
    color: #62685f;
    font-size: 0.82rem;
  }

  .read-link {
    color: #3e6047;
    font-weight: 650;
    white-space: nowrap;
  }

  footer {
    margin-top: 48px;
    padding-top: 20px;
    border-top: 1px solid #dfded7;
    color: #62685f;
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

    .post-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 520px) {
    .nav {
      gap: 14px;
    }

    .post-grid {
      grid-template-columns: 1fr;
    }

    .post-card {
      min-height: unset;
    }
  }
</style>
