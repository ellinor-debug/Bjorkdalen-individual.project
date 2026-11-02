<script>
  let { data, form } = $props();
  /** @type {{ error?: string, title?: string, body?: string } | null} */
  let actionForm = $derived(form);

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
  <title>Community — Björkdalen National Park</title>
  <meta name="description" content="Community discussions, tips and questions from Björkdalen National Park." />
</svelte:head>

<main class="content">
  <p class="eyebrow">From the trails</p>
  <h1>Community</h1>
  <p class="intro">Start a conversation, ask a question or share something you discovered.</p>

  {#if data.user}
    <form class="post-form" method="POST">
      <h2>Start a discussion</h2>
      {#if actionForm?.error}
        <p class="form-error" role="alert">{actionForm.error}</p>
      {/if}
      <label for="title">Title</label>
      <input id="title" name="title" required maxlength="160" value={actionForm?.title ?? ''} />
      <label for="body">Your post</label>
      <textarea id="body" name="body" rows="4" required maxlength="10000">{actionForm?.body ?? ''}</textarea>
      <button type="submit">Post</button>
    </form>
  {:else}
    <p class="signin-prompt">
      <a href="/login">Sign in</a> to share a tip.
    </p>
  {/if}

  <section class="discussions" aria-labelledby="discussion-heading">
    <h2 id="discussion-heading">Community posts</h2>
    {#if data.posts.length}
      <div class="post-list">
        {#each data.posts as post (post.slug)}
          <a class="post-card" href={`/community/${post.slug}`}>
            <h3>{post.title}</h3>
            <p class="post-meta">
              <span>By {post.author}</span>
              <time datetime={new Date(post.created_at).toISOString()}>{formatDate(post.created_at)}</time>
              <span>{post.reply_count} {post.reply_count === 1 ? 'reply' : 'replies'}</span>
            </p>
          </a>
        {/each}
      </div>
    {:else}
      <p class="empty-state">There are no community posts yet.</p>
    {/if}
  </section>

  <section class="latest-tips" aria-labelledby="tips-heading">
    <p class="eyebrow">From the paths</p>
    <h2 id="tips-heading">Latest trail tips</h2>
    {#if data.latestTips.length}
      <div class="tip-list">
        {#each data.latestTips as tip}
          <article class="tip-card">
            <p>{tip.body}</p>
            <p class="tip-meta">
              <span>{tip.author ?? 'Park visitor'}</span>
              <time datetime={new Date(tip.created_at).toISOString()}>{formatDate(tip.created_at)}</time>
            </p>
            <a href={`/posts/${tip.slug}`}>{tip.trail_title} <span aria-hidden="true">→</span></a>
          </article>
        {/each}
      </div>
    {:else}
      <p class="empty-state">There are no trail tips yet. Visit a trail to share one.</p>
    {/if}
  </section>
</main>

<style>
  .content {
    max-width: 1000px;
    margin: 0 auto;
    padding: 48px 28px 76px;
  }

  .eyebrow {
    margin: 0 0 8px;
    color: var(--color-accent);
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  h1,
  h2,
  h3 {
    color: var(--color-heading);
    font-family: Georgia, 'Times New Roman', serif;
    font-weight: 500;
  }

  h1 {
    margin: 0 0 8px;
    font-size: clamp(2.5rem, 7vw, 3.8rem);
  }

  h2 {
    margin: 0 0 14px;
    font-size: 1.7rem;
  }

  .intro {
    margin: 0 0 24px;
    color: var(--color-text-muted);
    font-size: 1.1rem;
  }

  .post-form,
  .post-card,
  .tip-card,
  .empty-state,
  .signin-prompt {
    border: 1px solid var(--color-border);
    border-radius: 14px;
    background: var(--color-surface);
  }

  .post-form {
    display: grid;
    gap: 10px;
    margin-bottom: 30px;
    padding: 22px;
  }

  .post-form h2 {
    margin-bottom: 2px;
  }

  label {
    font-weight: 650;
  }

  input,
  textarea {
    width: 100%;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 10px 12px;
    background: var(--color-surface);
    color: var(--color-text);
    font: inherit;
  }

  textarea {
    resize: vertical;
  }

  button {
    justify-self: start;
    margin-top: 6px;
    border: 0;
    border-radius: 999px;
    padding: 10px 18px;
    background: var(--color-accent);
    color: var(--color-white);
    cursor: pointer;
    font: inherit;
    font-weight: 700;
  }

  button:hover {
    background: var(--color-accent-hover);
  }

  .form-error {
    margin: 0;
    color: var(--color-danger);
  }

  .signin-prompt {
    margin-bottom: 30px;
    padding: 18px;
  }

  .signin-prompt a,
  .tip-card > a {
    color: var(--color-accent);
    font-weight: 700;
  }

  .discussions {
    margin-top: 30px;
  }

  .post-list,
  .tip-list {
    display: grid;
    gap: 12px;
  }

  .post-card,
  .tip-card {
    display: block;
    padding: 18px 20px;
  }

  .post-card:hover {
    border-color: var(--color-accent);
    box-shadow: 0 6px 18px var(--color-shadow);
  }

  .post-card h3 {
    margin: 0 0 8px;
    font-size: 1.35rem;
  }

  .post-meta,
  .tip-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 18px;
    margin: 0;
    color: var(--color-text-muted);
    font-size: 0.92rem;
  }

  .latest-tips {
    margin-top: 48px;
    padding-top: 24px;
    border-top: 1px solid var(--color-border);
  }

  .tip-card > p:first-child {
    margin-top: 0;
    white-space: pre-wrap;
  }

  .tip-card > a {
    display: inline-block;
    margin-top: 8px;
  }

  .empty-state {
    margin: 0;
    padding: 18px;
    color: var(--color-text-muted);
  }

  @media (max-width: 600px) {
    .content {
      padding: 38px 16px 56px;
    }

    .intro,
    .post-meta,
    .tip-meta,
    .tip-card > p:first-child,
    .signin-prompt,
    .empty-state {
      font-size: 1rem;
    }

    .post-form {
      padding: 16px;
    }

    .post-form input,
    .post-form textarea,
    .post-form button {
      width: 100%;
      min-height: 48px;
      font-size: 1rem;
    }

    .post-form button {
      justify-self: stretch;
    }

    .post-meta,
    .tip-meta {
      flex-direction: column;
      gap: 2px;
    }
  }
</style>
