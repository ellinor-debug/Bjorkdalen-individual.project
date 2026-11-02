<script>
  let { data, form } = $props();
  /** @type {{ error?: string, body?: string } | null} */
  let actionForm = $derived(form);

  /** @param {string | null} body */
  function trailDescription(body) {
    const text = body ?? '';
    return text.replace(/^Length:\s*.+?\s*·\s*Difficulty:\s*.+\r?\n?/i, '').trim();
  }

  /** @param {string} difficulty */
  function difficultyLabel(difficulty) {
    return ({
      'very-easy': 'Very easy',
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard',
      extreme: 'Extremely difficult'
    })[difficulty] ?? difficulty;
  }

  /** @param {string | Date} date */
  function formatDate(date) {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  const description = $derived(trailDescription(data.post.body));
</script>

<svelte:head>
  <title>{data.post.title} — Björkdalen National Park</title>
  <meta name="description" content={data.post.summary ?? data.post.title} />
</svelte:head>

<main class="content">
  <article class="trail">
    <p class="eyebrow">Dalarna · Sweden</p>
    <h1>{data.post.title}</h1>
    <div class="trail-facts">
      {#if data.post.length_km !== null}<span>{data.post.length_km} km</span>{/if}
      {#if data.post.difficulty}
        <span class={`difficulty ${data.post.difficulty}`}>{difficultyLabel(data.post.difficulty)}</span>
      {/if}
    </div>

    <div class="trail-body">
      {#each description.split(/\n\s*\n/) as paragraph}
        <p>{paragraph}</p>
      {/each}
    </div>

    <section id="tips" class="tips-section" aria-labelledby="tips-title">
      <div class="section-head">
        <p class="eyebrow">From the trail community</p>
        <h2 id="tips-title">Tips &amp; questions</h2>
      </div>

      {#if data.comments.length}
        <div class="comments">
          {#each data.comments as comment}
            <article class="comment">
              <div class="comment-heading">
                <h3>{comment.username}</h3>
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

      {#if data.user}
        <form class="tip-form" method="POST" action="?/addComment">
          <h3>Share a tip or ask a question</h3>
          <p class="posting-as">Posting as {data.user.username}</p>
          {#if actionForm?.error}
            <p class="form-error" role="alert">{actionForm.error}</p>
          {/if}

          <label for="body">Tip or question</label>
          <textarea
            id="body"
            name="body"
            rows="4"
            maxlength="5000"
            required
            aria-invalid={actionForm?.error && !actionForm.body ? 'true' : undefined}
          >{actionForm?.body ?? ''}</textarea>

          <button type="submit">Post tip or question</button>
        </form>
      {:else}
        <p class="signin-prompt">
          <a href="/login">Sign in</a> to share a tip.
        </p>
      {/if}
    </section>
  </article>
</main>

<style>
  .content {
    max-width: 860px;
    margin: 0 auto;
    padding: 54px 28px 72px;
  }

  .trail {
    max-width: 760px;
    margin: 0 auto;
  }

  .eyebrow {
    margin: 0 0 12px;
    color: var(--color-accent);
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  h1,
  h2 {
    margin-top: 0;
    color: var(--color-heading);
    font-family: Georgia, 'Times New Roman', serif;
    font-weight: 500;
    letter-spacing: -0.04em;
    line-height: 1.15;
  }

  h1 {
    margin-bottom: 12px;
    font-size: clamp(2.6rem, 6vw, 4.3rem);
  }

  .excerpt {
    margin: 0 0 16px;
    color: var(--color-text-muted);
    font-size: 1.15rem;
    line-height: 1.7;
  }

  .trail-facts {
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--color-text-muted);
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

  .difficulty.very-easy {
    background: var(--color-very-easy-bg);
    color: var(--color-very-easy-text);
  }

  .difficulty.extreme {
    background: var(--color-extreme-bg);
    color: var(--color-extreme-text);
  }

  .trail-body {
    margin-top: 30px;
    border-top: 1px solid var(--color-border);
    padding-top: 22px;
  }

  .trail-body p {
    margin-bottom: 20px;
    line-height: 1.8;
  }

  .tips-section {
    margin-top: 40px;
    border-top: 1px solid var(--color-border);
    padding-top: 28px;
  }

  .section-head {
    margin-bottom: 18px;
  }

  .section-head .eyebrow {
    margin-bottom: 6px;
  }

  h2 {
    margin-bottom: 0;
    font-size: clamp(1.9rem, 4vw, 2.5rem);
  }

  .comments {
    display: grid;
    gap: 12px;
  }

  .comment {
    padding: 18px;
    border: 1px solid var(--color-border);
    border-radius: 14px;
    background: var(--color-surface);
  }

  .comment-heading {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
  }

  .comment h3,
  .tip-form h3 {
    margin: 0 0 8px;
    color: var(--color-heading);
    font-size: 1.1rem;
  }

  .comment time {
    color: var(--color-text-muted);
  }

  .comment p,
  .empty-state {
    margin-bottom: 0;
    color: var(--color-text);
    line-height: 1.65;
    white-space: pre-wrap;
  }

  .tip-form {
    display: grid;
    gap: 10px;
    margin-top: 24px;
    padding: 22px;
    border: 1px solid var(--color-border);
    border-radius: 16px;
    background: var(--color-surface);
  }

  .tip-form label {
    color: var(--color-text);
    font-weight: 650;
  }

  .tip-form textarea {
    width: 100%;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 11px 12px;
    background: var(--color-surface);
    color: var(--color-text);
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
    background: var(--color-accent);
    color: var(--color-white);
    cursor: pointer;
    font: inherit;
    font-weight: 650;
  }

  .tip-form button:hover {
    background: var(--color-accent-hover);
  }

  .form-error {
    margin: 0;
    color: var(--color-danger);
    font-weight: 600;
  }

  .posting-as {
    margin: -4px 0 0;
    color: var(--color-text-muted);
  }

  .signin-prompt {
    margin: 24px 0 0;
    padding: 18px;
    border: 1px solid var(--color-border);
    border-radius: 14px;
    background: var(--color-surface);
  }

  .signin-prompt a {
    color: var(--color-accent);
    font-weight: 700;
  }

  .signin-prompt a:hover {
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  @media (max-width: 600px) {
    .content {
      padding: 38px 16px 56px;
    }

    .trail-body p,
    .comment p,
    .empty-state,
    .signin-prompt {
      font-size: 1rem;
    }

    .tip-form {
      padding: 16px;
    }

    .tip-form textarea,
    .tip-form button {
      width: 100%;
      min-height: 48px;
      font-size: 1rem;
    }

    .tip-form button {
      justify-self: stretch;
    }

    .comment-heading {
      align-items: flex-start;
      flex-direction: column;
      gap: 2px;
    }

  }
</style>
