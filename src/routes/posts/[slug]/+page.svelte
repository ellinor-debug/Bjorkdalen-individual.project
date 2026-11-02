<script>
  import AuthControls from '../../../lib/components/AuthControls.svelte';

  let { data, form } = $props();

  /** @param {string} body */
  function trailDetails(body) {
    const [firstLine, ...rest] = body.split('\n');
    const match = firstLine.match(/^Length:\s*(.+?)\s*·\s*Difficulty:\s*(Easy|Medium|Hard)$/);

    return {
      length: match?.[1] ?? null,
      difficulty: match?.[2] ?? null,
      description: match ? rest.join('\n').trim() : body
    };
  }

  /** @param {string | Date} date */
  function formatDate(date) {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  const details = $derived(trailDetails(data.post.body));
</script>

<svelte:head>
  <title>{data.post.title} — Björkdalen National Park</title>
  <meta name="description" content={data.post.summary ?? data.post.title} />
</svelte:head>

<div class="page-shell">
  <header class="topbar">
    <a class="brand" href="/" aria-label="Björkdalen National Park home">
      <span class="brand-mark" aria-hidden="true">B</span>
      <span>Björkdalen <span class="brand-light">National Park</span></span>
    </a>
    <div class="header-actions">
      <a class="back-link" href="/">← All trails</a>
      <div class="auth-controls"><AuthControls user={data.user} /></div>
    </div>
  </header>

  <main>
    <article class="trail">
      <a class="back-link mobile-back" href="/">← Back to all trails</a>
      <p class="meta">Dalarna · Sweden</p>
      <h1>{data.post.title}</h1>
      <p class="excerpt">{data.post.summary}</p>

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

      <div class="trail-body">
        {#each details.description.split(/\n\s*\n/) as paragraph}
          <p>{paragraph}</p>
        {/each}
      </div>

      <section id="tips" class="tips-section" aria-labelledby="tips-title">
        <div class="section-head">
          <p class="meta">From the trail community</p>
          <h2 id="tips-title">Tips &amp; questions</h2>
        </div>

        {#if data.comments.length}
          <div class="comments">
            {#each data.comments as comment}
              <article class="comment">
                <div class="comment-heading">
                  <h3>{comment.name}</h3>
                  {#if comment.created_at}
                    <time datetime={new Date(comment.created_at).toISOString()}>
                      {formatDate(comment.created_at)}
                    </time>
                  {/if}
                </div>
                <p>{comment.body}</p>
              </article>
            {/each}
          </div>
        {:else}
          <p class="empty-state">No tips or questions yet. Be the first to share one.</p>
        {/if}

        <form class="tip-form" method="POST" action="?/addComment">
          <h3>Share a tip or ask a question</h3>
          {#if form?.error}
            <p class="form-error" role="alert">{form.error}</p>
          {/if}

          <label for="name">Your name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={form?.name ?? ''}
            required
            autocomplete="name"
            aria-invalid={form?.error && !form.name ? 'true' : undefined}
          />

          <label for="body">Tip or question</label>
          <textarea
            id="body"
            name="body"
            rows="4"
            required
            aria-invalid={form?.error && !form.body ? 'true' : undefined}
          >{form?.body ?? ''}</textarea>

          <button type="submit">Post tip or question</button>
        </form>
      </section>

      <a class="back-link end-link" href="/">← Back to all trails</a>
    </article>
  </main>
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

  a:focus-visible,
  button:focus-visible,
  input:focus-visible,
  textarea:focus-visible {
    outline: 3px solid #718a55;
    outline-offset: 3px;
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
    border-bottom: 1px solid #d8d8c9;
  }

  .brand {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-weight: 750;
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

  .header-actions {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .back-link {
    color: #355b3d;
    font-weight: 650;
  }

  .back-link:hover {
    text-decoration: underline;
    text-underline-offset: 4px;
  }

  .trail {
    max-width: 720px;
    margin: 0 auto;
    padding: 64px 0 24px;
  }

  .mobile-back {
    display: none;
  }

  .meta {
    margin: 0 0 16px;
    color: #507446;
    font-size: 0.78rem;
    font-weight: 750;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  h1,
  h2,
  h3,
  p {
    margin-top: 0;
  }

  h1 {
    margin-bottom: 18px;
    font-family: Georgia, 'Times New Roman', serif;
    font-size: clamp(2.6rem, 6vw, 4.7rem);
    font-weight: 500;
    letter-spacing: -0.055em;
    line-height: 1;
  }

  .excerpt {
    margin: 0 0 18px;
    color: #536052;
    font-size: 1.2rem;
    line-height: 1.65;
  }

  .trail-facts {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #536052;
    font-size: 0.9rem;
  }

  .difficulty {
    padding: 5px 10px;
    border-radius: 999px;
    font-size: 0.76rem;
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

  .trail-body {
    margin-top: 32px;
    border-top: 1px solid #d8d8c9;
    padding-top: 24px;
  }

  .trail-body p {
    margin-bottom: 22px;
    font-size: 1.08rem;
    line-height: 1.85;
  }

  .tips-section {
    margin-top: 46px;
    border-top: 1px solid #d8d8c9;
    padding-top: 32px;
  }

  .section-head {
    margin-bottom: 22px;
  }

  .section-head .meta {
    margin-bottom: 8px;
  }

  h2 {
    margin-bottom: 0;
    font-family: Georgia, 'Times New Roman', serif;
    font-size: clamp(1.9rem, 4vw, 2.6rem);
    font-weight: 500;
    letter-spacing: -0.04em;
  }

  .comments {
    display: grid;
    gap: 12px;
  }

  .comment {
    padding: 18px;
    border: 1px solid #dedecf;
    border-radius: 14px;
    background: #fffef9;
  }

  .comment-heading {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
  }

  .comment h3,
  .tip-form h3 {
    margin-bottom: 8px;
    font-size: 1rem;
  }

  .comment time {
    color: #777a67;
    font-size: 0.8rem;
  }

  .comment p,
  .empty-state {
    margin-bottom: 0;
    color: #536052;
    line-height: 1.65;
    white-space: pre-wrap;
  }

  .tip-form {
    display: grid;
    gap: 10px;
    margin-top: 28px;
    padding: 22px;
    border: 1px solid #dedecf;
    border-radius: 16px;
    background: #fffef9;
  }

  .tip-form h3 {
    margin-bottom: 4px;
    font-size: 1.15rem;
  }

  .tip-form label {
    color: #425444;
    font-size: 0.9rem;
    font-weight: 650;
  }

  .tip-form input,
  .tip-form textarea {
    width: 100%;
    border: 1px solid #c9cdbf;
    border-radius: 8px;
    padding: 11px 12px;
    background: #fff;
    color: #23372a;
    font: inherit;
  }

  .tip-form textarea {
    resize: vertical;
  }

  .tip-form button {
    justify-self: start;
    margin-top: 6px;
    border: 0;
    border-radius: 999px;
    padding: 12px 18px;
    background: #355b3d;
    color: white;
    cursor: pointer;
    font: inherit;
    font-weight: 650;
  }

  .tip-form button:hover {
    background: #284b31;
  }

  .form-error {
    margin-bottom: 2px;
    color: #a3312c;
    font-size: 0.92rem;
    font-weight: 600;
  }

  .end-link {
    display: inline-block;
    margin-top: 28px;
  }

  @media (max-width: 600px) {
    .page-shell {
      padding: 20px 18px 32px;
    }

    .topbar > .header-actions {
      display: none;
    }

    .mobile-back {
      display: inline-block;
      margin-bottom: 32px;
    }

    .trail {
      padding-top: 36px;
    }
  }
</style>
