<script>
  import { page } from '$app/state';
  import { enhance } from '$app/forms';

  let { data, form } = $props();
  /** @type {{ error?: string, title?: string, body?: string, formType?: string } | null} */
  let actionForm = $derived(form);
  let updateTitle = $state('');
  let updateBody = $state('');
  let outline = $state('');
  let writingDraft = $state(false);
  let draftError = $state('');
  const messageColours = ['#dce8d5', '#f2e4c9', '#d8e8ee', '#f4ded2', '#e7dff0', '#e3e8c9', '#f0dfe5'];

  $effect(() => {
    if (actionForm?.formType === 'update') {
      updateTitle = actionForm.title ?? '';
      updateBody = actionForm.body ?? '';
    }
  });

  /** @param {string | Date} date */
  function formatDate(date) {
    return new Date(date).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function signInUrl() {
    const returnTo = `${page.url.pathname}${page.url.search}${page.url.hash}`;
    return `/login?returnTo=${encodeURIComponent(returnTo)}`;
  }

  /** Give each user a stable soft colour based on their ID. */
  /** @param {string | number} userId */
  function messageColour(userId) {
    const id = String(userId);
    let hash = 0;
    for (let index = 0; index < id.length; index += 1) {
      hash = (hash * 31 + id.charCodeAt(index)) >>> 0;
    }
    return messageColours[hash % messageColours.length];
  }
</script>

<svelte:head>
  <title>Community — Björkdalen National Park</title>
  <meta name="description" content="Park updates, hiker questions and community chat for Björkdalen National Park." />
</svelte:head>

<main class="content">
  <header class="page-heading">
    <h1>Community</h1>
    <p>Updates from the park, questions from hikers, and a place to share trail tips.</p>
  </header>

  <section id="updates" class="section" aria-labelledby="updates-heading">
    <div class="section-heading">
      <h2 id="updates-heading">Park updates</h2>
      {#if data.user?.role === 'admin'}
        <a class="section-action" href="#new-update">New update</a>
      {/if}
    </div>
    {#if data.user?.role === 'admin'}
      <form
        id="new-update"
        class="form-card"
        method="POST"
        action="?/newUpdate"
        use:enhance={({ submitter }) => {
          if (!(submitter instanceof HTMLButtonElement) || submitter.value !== 'draft') return;
          writingDraft = true;
          draftError = '';
          return async ({ result, update }) => {
            await update({ reset: false });
            writingDraft = false;
            if (result.type === 'success' || result.type === 'failure') {
              /** @type {{ formType?: string, error?: unknown, title?: unknown, body?: unknown, outline?: unknown } | undefined} */
              const resultData = result.data;
              if (resultData?.formType === 'draft') {
                if (typeof resultData.error === 'string') {
                  draftError = resultData.error;
                } else {
                  updateTitle = typeof resultData.title === 'string' ? resultData.title : '';
                  updateBody = typeof resultData.body === 'string' ? resultData.body : '';
                  outline = typeof resultData.outline === 'string' ? resultData.outline : outline;
                }
              }
            }
          };
        }}
      >
        <h3>New update</h3>
        {#if actionForm?.error && actionForm.formType === 'update'}
          <p class="form-error" role="alert">{actionForm.error}</p>
        {/if}
        {#if draftError}
          <p class="form-error" role="alert">{draftError}</p>
        {/if}
        <label for="update-outline">Short outline</label>
        <textarea id="update-outline" name="outline" rows="2" maxlength="2000" bind:value={outline} required></textarea>
        <button type="submit" name="intent" value="draft" formaction="?/writeDraft" formnovalidate disabled={writingDraft}>
          {writingDraft ? 'Writing draft…' : 'Write draft with AI'}
        </button>
        <label for="update-title">Title</label>
        <input id="update-title" name="title" maxlength="160" required bind:value={updateTitle} />
        <label for="update-body">Update</label>
        <textarea id="update-body" name="body" rows="4" maxlength="10000" required bind:value={updateBody}></textarea>
        <button type="submit">Post update</button>
      </form>
    {/if}
    {#if data.updates.length}
      <div class="post-list">
        {#each data.updates as post (post.id)}
          <a class="post-card" href={`/community/${post.slug}`}>
            <h3>{post.title}</h3>
            <p class="post-meta">
              <span>
                {post.author}
                {#if post.role === 'admin'}<span class="staff-label">Park staff</span>{/if}
              </span>
              <time datetime={new Date(post.created_at).toISOString()}>{formatDate(post.created_at)}</time>
              <span>{post.comment_count} {post.comment_count === 1 ? 'comment' : 'comments'}</span>
            </p>
            <p class="preview">{post.body}</p>
          </a>
        {/each}
      </div>
    {:else}
      <p class="empty-state">There are no park updates yet.</p>
    {/if}
  </section>

  <section id="questions" class="section" aria-labelledby="questions-heading">
    <div class="section-heading">
      <h2 id="questions-heading">Questions</h2>
      {#if data.user?.role === 'member'}
        <a class="section-action" href="#ask-question">Ask a question</a>
      {:else if !data.user}
        <a class="section-action" href="#question-signin">Ask a question</a>
      {/if}
    </div>
    {#if data.user?.role === 'member'}
      <form id="ask-question" class="form-card" method="POST" action="?/askQuestion">
        <h3>Ask a question</h3>
        {#if actionForm?.error && actionForm.formType === 'question'}
          <p class="form-error" role="alert">{actionForm.error}</p>
        {/if}
        <label for="question-title">Title</label>
        <input id="question-title" name="title" maxlength="160" required value={actionForm?.formType === 'question' ? actionForm.title ?? '' : ''} />
        <label for="question-body">Question</label>
        <textarea id="question-body" name="body" rows="4" maxlength="10000" required>{actionForm?.formType === 'question' ? actionForm.body ?? '' : ''}</textarea>
        <button type="submit">Post question</button>
      </form>
    {:else if !data.user}
      <p id="question-signin" class="signin-prompt">
        Sign in to take part. <a href={signInUrl()}>Sign in</a>
      </p>
    {/if}
    {#if data.questions.length}
      <div class="post-list">
        {#each data.questions as post (post.id)}
          <article class="post-entry">
            <a class="post-card" href={`/community/${post.slug}`}>
              <h3>{post.title}</h3>
              <p class="post-meta">
                <span>
                  {post.author}
                  {#if post.role === 'admin'}<span class="staff-label">Park staff</span>{/if}
                </span>
                <time datetime={new Date(post.created_at).toISOString()}>{formatDate(post.created_at)}</time>
                <span>
                  {#if post.comment_count === 0}
                    No answers yet
                  {:else}
                    {post.comment_count} {post.comment_count === 1 ? 'answer' : 'answers'}
                  {/if}
                </span>
              </p>
              <p class="preview">{post.body}</p>
            </a>
            {#if data.user?.role === 'admin'}
              <form method="POST" action="?/deleteQuestion" onsubmit={(event) => { if (!confirm('Delete this question and its answers?')) event.preventDefault(); }}>
                <input type="hidden" name="slug" value={post.slug} />
                <button class="delete-button" type="submit">Delete</button>
              </form>
            {/if}
          </article>
        {/each}
      </div>
    {:else}
      <p class="empty-state">There are no questions yet.</p>
    {/if}
  </section>

  <section id="chat" class="section chat-section" aria-labelledby="chat-heading">
    <h2 id="chat-heading">Hiker chat</h2>
    <div class="chat-feed" aria-label="Latest hiker messages">
      {#if data.messages.length}
        {#each data.messages as message (message.id)}
          {@const isOwnMessage = data.user && String(message.user_id) === String(data.user.id)}
          <article class="message" class:own-message={isOwnMessage}>
            {#if !isOwnMessage}
              <p class="message-author">
                {message.username}
                {#if message.role === 'admin'}<span class="staff-label">Park staff</span>{/if}
              </p>
            {:else if message.role === 'admin'}
              <p class="message-author"><span class="staff-label">Park staff</span></p>
            {/if}
            <div class="bubble-wrap" style={`--message-color: ${messageColour(message.user_id)}`}>
            <p class="bubble">{message.body}</p>
            <time class="message-time" datetime={new Date(message.created_at).toISOString()}>{formatDate(message.created_at)}</time>
            </div>
            {#if data.user?.role === 'admin'}
              <form method="POST" action="?/deleteMessage" onsubmit={(event) => { if (!confirm('Delete this chat message?')) event.preventDefault(); }}>
                <input type="hidden" name="messageId" value={message.id} />
                <button class="delete-button" type="submit">Delete</button>
              </form>
            {/if}
          </article>
        {/each}
      {:else}
        <p class="empty-state">No messages yet. Start the conversation.</p>
      {/if}
    </div>

    {#if data.user}
      <form class="chat-form" method="POST" action="?/sendMessage">
        {#if actionForm?.error && actionForm.formType === 'message'}
          <p class="form-error" role="alert">{actionForm.error}</p>
        {/if}
        <label class="sr-only" for="chat-message">Message</label>
        <textarea id="chat-message" name="body" rows="2" maxlength="500" required placeholder="Share a short trail tip…">{actionForm?.formType === 'message' ? actionForm.body ?? '' : ''}</textarea>
        <button type="submit">Send</button>
      </form>
    {:else}
      <p class="signin-prompt">
        Sign in to take part. <a href={signInUrl()}>Sign in</a>
      </p>
    {/if}
  </section>
</main>

<style>
  .content {
    width: min(100% - 36px, 1000px);
    margin: 0 auto;
    padding: 44px 0 72px;
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
    font-size: clamp(2.4rem, 6vw, 3.6rem);
  }

  h2 {
    margin: 0;
    font-size: 1.8rem;
  }

  h3 {
    margin: 0 0 8px;
    font-size: 1.3rem;
  }

  .page-heading {
    margin-bottom: 32px;
  }

  .page-heading > p {
    margin: 0;
    color: var(--color-text-muted);
    font-size: 1.1rem;
  }

  .section {
    margin-top: 36px;
    padding-top: 24px;
    border-top: 1px solid var(--color-border);
  }

  .section-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    margin-bottom: 16px;
  }

  .section-action,
  .signin-prompt a {
    color: var(--color-accent);
    font-weight: 700;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  .post-list {
    display: grid;
    gap: 12px;
  }

  .post-entry {
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }

  .post-entry > .post-card {
    flex: 1;
  }

  .post-card,
  .form-card,
  .chat-feed,
  .chat-form {
    border: 1px solid var(--color-border);
    border-radius: 10px;
    background: var(--color-surface);
  }

  .post-card {
    display: block;
    padding: 18px;
    color: inherit;
  }

  .post-card:hover {
    border-color: var(--color-accent);
  }

  .delete-button {
    border: 0;
    padding: 8px 10px;
    color: #8b2f24;
    background: transparent;
    text-decoration: underline;
    cursor: pointer;
  }

  .post-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 16px;
    margin: 0;
    color: var(--color-text-muted);
    font-size: 0.9rem;
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

  .preview {
    display: -webkit-box;
    overflow: hidden;
    margin: 10px 0 0;
    color: var(--color-text);
    line-height: 1.6;
    white-space: pre-line;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }

  .form-card {
    display: grid;
    gap: 10px;
    margin-bottom: 16px;
    padding: 18px;
  }

  label {
    font-weight: 650;
  }

  input,
  textarea {
    width: 100%;
    min-width: 0;
    border: 1px solid var(--color-border);
    border-radius: 7px;
    padding: 10px 12px;
    background: var(--color-page);
    color: var(--color-text);
    font: inherit;
    font-size: 1rem;
  }

  textarea {
    resize: vertical;
  }

  button {
    justify-self: start;
    min-height: 44px;
    border: 0;
    border-radius: 999px;
    padding: 9px 18px;
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

  .signin-prompt,
  .empty-state {
    margin: 0;
    padding: 14px 0;
    color: var(--color-text-muted);
  }

  .chat-feed {
    display: flex;
    min-height: 120px;
    max-height: 480px;
    flex-direction: column;
    gap: 14px;
    overflow-y: auto;
    padding: 16px;
  }

  .message {
    max-width: 75%;
    align-self: flex-start;
  }

  .message.own-message {
    align-self: flex-end;
  }

  .message-author {
    margin: 0 0 4px;
    color: var(--color-text-muted);
    font-size: 0.82rem;
  }

  .bubble-wrap {
    width: fit-content;
    max-width: 100%;
  }

  .bubble {
    margin: 0;
    border-radius: 12px 12px 12px 3px;
    padding: 10px 13px;
    background: var(--message-color);
    color: var(--color-text);
    line-height: 1.5;
    overflow-wrap: anywhere;
    white-space: pre-wrap;
  }

  .message.own-message .bubble {
    border-radius: 12px 12px 3px 12px;
    background: var(--color-heading);
    color: var(--color-page);
  }

  .message-time {
    display: block;
    margin-top: 3px;
    color: var(--color-text-muted);
    font-size: 0.75rem;
  }

  .message.own-message .message-time {
    text-align: right;
  }

  .message form {
    display: flex;
    justify-content: flex-end;
  }

  .chat-form {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: end;
    gap: 10px;
    margin-top: 12px;
    padding: 12px;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    clip-path: inset(50%);
  }

  @media (max-width: 600px) {
    .content {
      padding-top: 36px;
    }

    .section-heading {
      align-items: flex-start;
      flex-direction: column;
    }

    .post-meta {
      flex-direction: column;
      gap: 3px;
      font-size: 1rem;
    }

    .message {
      max-width: 85%;
    }

    .chat-form {
      grid-template-columns: 1fr;
    }

    .chat-form button {
      width: 100%;
      justify-self: stretch;
    }
  }
</style>
