<script>
  let { data, form } = $props();
  /** @type {{ error?: string, body?: string } | null} */
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
  <title>{data.post.title} — Björkdalen Community</title>
</svelte:head>

<main class="content">
  <a class="back-link" href="/community">← Community</a>
  <article class="community-post">
    <p class="eyebrow">Community discussion</p>
    <h1>{data.post.title}</h1>
    <p class="post-meta">
      <span>By {data.post.author}</span>
      <time datetime={new Date(data.post.created_at).toISOString()}>{formatDate(data.post.created_at)}</time>
    </p>
    <div class="post-body">{data.post.body}</div>
  </article>

  <section class="replies" aria-labelledby="replies-heading">
    <h2 id="replies-heading">Replies ({data.replies.length})</h2>
    {#if data.replies.length}
      <div class="reply-list">
        {#each data.replies as reply}
          <article class="reply">
            <div class="reply-heading">
              <h3>{reply.author ?? 'Park visitor'}</h3>
              <time datetime={new Date(reply.created_at).toISOString()}>{formatDate(reply.created_at)}</time>
            </div>
            <p>{reply.body}</p>
          </article>
        {/each}
      </div>
    {:else}
      <p class="empty-state">No replies yet.</p>
    {/if}

    {#if data.user}
      <form class="reply-form" method="POST" action="?/reply">
        <h3>Reply as {data.user.username}</h3>
        {#if actionForm?.error}
          <p class="form-error" role="alert">{actionForm.error}</p>
        {/if}
        <label for="reply-body">Your reply</label>
        <textarea id="reply-body" name="body" rows="4" maxlength="5000" required>{actionForm?.body ?? ''}</textarea>
        <button type="submit">Post reply</button>
      </form>
    {:else}
      <p class="signin-prompt">
        <a href="/login">Sign in</a> to share a tip.
      </p>
    {/if}
  </section>
</main>

<style>
  .content {
    max-width: 860px;
    margin: 0 auto;
    padding: 48px 28px 76px;
  }

  .back-link {
    display: inline-block;
    margin-bottom: 20px;
    color: var(--color-accent);
    font-weight: 700;
  }

  .back-link:hover {
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  .community-post,
  .reply,
  .reply-form,
  .empty-state,
  .signin-prompt {
    border: 1px solid var(--color-border);
    border-radius: 14px;
    background: var(--color-surface);
  }

  .community-post {
    padding: 24px;
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
    margin: 0 0 10px;
    font-size: clamp(2.2rem, 6vw, 3.5rem);
  }

  h2 {
    margin: 0 0 16px;
    font-size: 1.8rem;
  }

  .post-meta,
  .reply-heading {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    color: var(--color-text-muted);
  }

  .post-body,
  .reply > p {
    white-space: pre-wrap;
  }

  .post-body {
    margin-top: 20px;
    line-height: 1.7;
  }

  .replies {
    margin-top: 32px;
  }

  .reply-list {
    display: grid;
    gap: 12px;
  }

  .reply {
    padding: 18px;
  }

  .reply-heading h3 {
    margin: 0 0 8px;
    font-family: inherit;
    font-size: 1.05rem;
    font-weight: 700;
  }

  .reply-heading time {
    font-size: 0.9rem;
  }

  .reply > p {
    margin: 0;
  }

  .empty-state,
  .signin-prompt {
    padding: 16px;
    color: var(--color-text-muted);
  }

  .reply-form {
    display: grid;
    gap: 10px;
    margin-top: 22px;
    padding: 22px;
  }

  .reply-form h3 {
    margin: 0;
    font-size: 1.2rem;
  }

  label {
    font-weight: 650;
  }

  textarea {
    width: 100%;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 10px 12px;
    background: var(--color-surface);
    color: var(--color-text);
    font: inherit;
    resize: vertical;
  }

  button {
    justify-self: start;
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

  .signin-prompt a {
    color: var(--color-accent);
    font-weight: 700;
  }

  @media (max-width: 600px) {
    .content {
      padding: 38px 16px 56px;
    }

    .community-post,
    .reply,
    .post-body,
    .reply > p,
    .signin-prompt,
    .empty-state {
      font-size: 1rem;
    }

    .community-post,
    .reply-form {
      padding: 16px;
    }

    .reply-form textarea,
    .reply-form button {
      width: 100%;
      min-height: 48px;
      font-size: 1rem;
    }

    .reply-form button {
      justify-self: stretch;
    }

    .post-meta,
    .reply-heading {
      flex-direction: column;
      gap: 3px;
    }
  }
</style>
