<script>
  import { page } from '$app/state';

  let { data, form } = $props();
  /** @type {{ error?: string, body?: string, title?: string } | null} */
  let actionForm = $derived(form);

  /** @param {string | Date} date */
  function formatDate(date) {
    return new Date(date).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  const responseLabel = $derived(data.post.type === 'question' ? 'Answers' : 'Comments');
  const participationVerb = $derived(data.post.type === 'question' ? 'answer' : 'comment');

  function signInUrl() {
    const returnTo = `${page.url.pathname}${page.url.search}#comments`;
    return `/login?returnTo=${encodeURIComponent(returnTo)}`;
  }
</script>

<svelte:head>
  <title>{data.post.title} — Björkdalen Community</title>
</svelte:head>

<main class="content">
  <a class="back-link" href="/community">← Community</a>
  <article class="community-post">
    {#if data.user?.role === 'admin'}
      <div class="admin-controls">
        {#if data.post.type === 'update'}
          <details class="edit-panel">
            <summary>Edit</summary>
            <form method="POST" action="?/editUpdate">
              <label for="edit-title">Title</label>
              <input id="edit-title" name="title" maxlength="160" required value={actionForm?.title ?? data.post.title} />
              <label for="edit-body">Update</label>
              <textarea id="edit-body" name="body" rows="5" maxlength="10000" required>{actionForm?.body ?? data.post.body}</textarea>
              {#if actionForm?.error}<p class="form-error" role="alert">{actionForm.error}</p>{/if}
              <button type="submit">Save changes</button>
            </form>
          </details>
          <form method="POST" action="?/deleteUpdate" onsubmit={(event) => { if (!confirm('Delete this update and its comments?')) event.preventDefault(); }}>
            <button class="delete-button" type="submit">Delete update</button>
          </form>
        {:else}
          <form method="POST" action="?/deleteQuestion" onsubmit={(event) => { if (!confirm('Delete this question and its answers?')) event.preventDefault(); }}>
            <button class="delete-button" type="submit">Delete question</button>
          </form>
        {/if}
      </div>
    {/if}
    <h1>{data.post.title}</h1>
    <p class="post-meta">
      <span>
        {data.post.author}
        {#if data.post.role === 'admin'}<span class="staff-label">Park staff</span>{/if}
      </span>
      <time datetime={new Date(data.post.created_at).toISOString()}>{formatDate(data.post.created_at)}</time>
    </p>
    <div class="post-body">{data.post.body}</div>
  </article>

  <section id="comments" class="replies" aria-labelledby="replies-heading">
    <h2 id="replies-heading">{responseLabel} ({data.comments.length})</h2>
    {#if data.comments.length}
      <div class="reply-list">
        {#each data.comments as comment (comment.id)}
          <article class="reply">
            <div class="reply-heading">
              <h3>
                {comment.author}
                {#if comment.role === 'admin'}<span class="staff-label">Park staff</span>{/if}
              </h3>
              <time datetime={new Date(comment.created_at).toISOString()}>{formatDate(comment.created_at)}</time>
            </div>
            <p>{comment.body}</p>
            {#if data.user?.role === 'admin'}
              <form method="POST" action="?/deleteComment" onsubmit={(event) => { if (!confirm('Delete this comment?')) event.preventDefault(); }}>
                <input type="hidden" name="commentId" value={comment.id} />
                <button class="delete-button" type="submit">Delete</button>
              </form>
            {/if}
          </article>
        {/each}
      </div>
    {:else}
      <p class="empty-state">No {participationVerb === 'answer' ? 'answers' : 'comments'} yet.</p>
    {/if}

    {#if data.post.type === 'question' && data.user?.role === 'admin'}
      <form class="reply-form" method="POST" action="?/comment">
        <h3>Write an answer</h3>
        {#if actionForm?.error}
          <p class="form-error" role="alert">{actionForm.error}</p>
        {/if}
        <label for="comment-body">Your answer</label>
        <textarea id="comment-body" name="body" rows="4" maxlength="5000" required>{actionForm?.body ?? ''}</textarea>
        <button type="submit">Post answer</button>
      </form>
    {:else if data.post.type === 'question' && data.user}
      <p class="staff-answer-note">Questions are answered by park staff.</p>
    {:else if data.post.type === 'update' && data.user}
      <form class="reply-form" method="POST" action="?/comment">
        <h3>Comment on this update</h3>
        {#if actionForm?.error}
          <p class="form-error" role="alert">{actionForm.error}</p>
        {/if}
        <label for="comment-body">Your comment</label>
        <textarea id="comment-body" name="body" rows="4" maxlength="5000" required>{actionForm?.body ?? ''}</textarea>
        <button type="submit">Post comment</button>
      </form>
    {:else}
      <p class="signin-prompt"><a href={signInUrl()}>Sign in to take part</a></p>
    {/if}
  </section>
</main>

<style>
  .content {
    width: min(100% - 36px, 860px);
    margin: 0 auto;
    padding: 48px 0 76px;
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
  .reply-form {
    border: 1px solid var(--color-border);
    border-radius: 10px;
    background: var(--color-surface);
  }

  .community-post {
    padding: 24px;
  }

  .admin-controls {
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 12px;
  }

  .edit-panel summary {
    color: var(--color-accent);
    cursor: pointer;
    font-weight: 700;
  }

  .edit-panel form {
    display: grid;
    gap: 10px;
    min-width: min(80vw, 420px);
    margin-top: 12px;
  }

  .edit-panel input {
    width: 100%;
    min-width: 0;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 10px 12px;
    background: var(--color-page);
    color: var(--color-text);
    font: inherit;
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

  .staff-label {
    display: inline-block;
    margin-left: 7px;
    border-radius: 999px;
    padding: 1px 7px;
    background: var(--color-surface-muted);
    color: var(--color-heading);
    font-size: 0.75rem;
    font-weight: 700;
  }

  .post-body,
  .reply > p {
    white-space: pre-wrap;
    overflow-wrap: anywhere;
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
    font-size: 1rem;
    font-weight: 700;
  }

  .reply-heading time {
    font-size: 0.9rem;
  }

  .reply > p {
    margin: 0;
  }

  .empty-state,
  .signin-prompt,
  .staff-answer-note {
    padding: 16px 0;
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
    min-width: 0;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 10px 12px;
    background: var(--color-page);
    color: var(--color-text);
    font: inherit;
    resize: vertical;
  }

  button {
    justify-self: start;
    min-height: 44px;
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

  .delete-button {
    min-height: 36px;
    border: 0;
    padding: 6px 10px;
    background: transparent;
    color: #8b2f24;
    text-decoration: underline;
  }

  .delete-button:hover {
    background: transparent;
    color: #5f1e17;
  }

  .form-error {
    margin: 0;
    color: var(--color-danger);
  }

  .signin-prompt a {
    color: var(--color-accent);
    font-weight: 700;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  @media (max-width: 600px) {
    .content {
      padding-top: 38px;
    }

    .community-post,
    .reply-form {
      padding: 16px;
    }

    .post-meta,
    .reply-heading {
      flex-direction: column;
      gap: 3px;
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
  }
</style>
