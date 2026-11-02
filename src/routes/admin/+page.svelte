<script>
  let { data } = $props();

  /** @param {string | Date} date */
  function formatDate(date) {
    return new Date(date).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
</script>

<svelte:head>
  <title>Admin — Björkdalen National Park</title>
</svelte:head>

<main class="content">
  <a class="back-link" href="/">← Home</a>
  <h1>Admin</h1>

  <section aria-labelledby="counts-heading">
    <h2 id="counts-heading">Overview</h2>
    <dl class="counts">
      <div><dt>Members</dt><dd>{data.counts.members}</dd></div>
      <div><dt>Questions</dt><dd>{data.counts.questions}</dd></div>
      <div><dt>Unanswered questions</dt><dd>{data.counts.unanswered_questions}</dd></div>
      <div><dt>Comments</dt><dd>{data.counts.comments}</dd></div>
      <div><dt>Chat messages</dt><dd>{data.counts.messages}</dd></div>
    </dl>
  </section>

  <section aria-labelledby="unanswered-heading">
    <h2 id="unanswered-heading">Unanswered questions</h2>
    {#if data.unansweredQuestions.length}
      <ul class="items">
        {#each data.unansweredQuestions as question (question.id)}
          <li>
            <div>
              <a href={`/community/${question.slug}#comments`}>{question.title}</a>
              <p>
                {question.author}
                {#if question.role === 'admin'}<span class="staff-label">Park staff</span>{/if}
                · {formatDate(question.created_at)}
              </p>
            </div>
            <form method="POST" action="?/deleteQuestion" onsubmit={(event) => { if (!confirm('Delete this question and its answers?')) event.preventDefault(); }}>
              <input type="hidden" name="slug" value={question.slug} />
              <button class="delete-button" type="submit">Delete</button>
            </form>
          </li>
        {/each}
      </ul>
    {:else}
      <p class="empty-state">All questions have answers.</p>
    {/if}
  </section>

  <section aria-labelledby="activity-heading">
    <h2 id="activity-heading">Latest activity</h2>
    {#if data.activity.length}
      <ul class="items">
        {#each data.activity as item (`${item.kind}-${item.item_id}`)}
          <li>
            <div>
              <p class="activity-meta">
                {item.author}
                {#if item.role === 'admin'}<span class="staff-label">Park staff</span>{/if}
                · {formatDate(item.created_at)} · <a href={item.href}>{item.context}</a>
              </p>
              <p class="activity-body">{item.body}</p>
              <span class="activity-type">{item.kind === 'message' ? 'Chat message' : 'Comment / answer'}</span>
            </div>
            <form method="POST" action={item.kind === 'message' ? '?/deleteMessage' : '?/deleteComment'} onsubmit={(event) => { if (!confirm(`Delete this ${item.kind}?`)) event.preventDefault(); }}>
              <input type="hidden" name={item.kind === 'message' ? 'messageId' : 'commentId'} value={item.item_id} />
              <button class="delete-button" type="submit">Delete</button>
            </form>
          </li>
        {/each}
      </ul>
    {:else}
      <p class="empty-state">No comments or chat messages yet.</p>
    {/if}
  </section>
</main>

<style>
  .content {
    width: min(100% - 36px, 1000px);
    margin: 0 auto;
    padding: 38px 0 72px;
  }

  h1,
  h2 {
    color: var(--color-heading);
    font-family: Georgia, 'Times New Roman', serif;
    font-weight: 500;
  }

  h1 {
    margin: 14px 0 28px;
    font-size: clamp(2.2rem, 5vw, 3.2rem);
  }

  h2 {
    margin: 30px 0 14px;
    font-size: 1.6rem;
  }

  .back-link {
    color: var(--color-accent);
    font-weight: 700;
  }

  .counts {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 12px;
    margin: 0;
  }

  .counts > div,
  .items li {
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 14px;
    background: var(--color-surface);
  }

  .counts dt {
    color: var(--color-text-muted);
    font-size: 0.9rem;
  }

  .counts dd {
    margin: 5px 0 0;
    color: var(--color-heading);
    font-size: 1.7rem;
    font-weight: 700;
  }

  .items {
    display: grid;
    gap: 10px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .items li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .items a {
    color: var(--color-accent);
    font-weight: 700;
  }

  .items p {
    margin: 5px 0 0;
    color: var(--color-text-muted);
  }

  .activity-meta {
    font-size: 0.9rem;
  }

  .activity-body {
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }

  .activity-type {
    color: var(--color-text-muted);
    font-size: 0.8rem;
    text-transform: capitalize;
  }

  .staff-label {
    display: inline-block;
    margin-left: 5px;
    border-radius: 999px;
    padding: 1px 7px;
    background: var(--color-surface-muted);
    color: var(--color-heading);
    font-size: 0.75rem;
    font-weight: 700;
  }

  .delete-button {
    min-height: 38px;
    border: 0;
    padding: 6px 10px;
    background: transparent;
    color: #8b2f24;
    font: inherit;
    text-decoration: underline;
    cursor: pointer;
  }

  .delete-button:hover {
    color: #5f1e17;
  }

  .empty-state {
    color: var(--color-text-muted);
  }

  @media (max-width: 700px) {
    .counts {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .items li {
      align-items: flex-start;
      padding: 12px;
    }
  }
</style>
