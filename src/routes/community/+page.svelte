<script>
  let { data } = $props();

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
  <meta name="description" content="Recent trail tips and questions from the Björkdalen community." />
</svelte:head>

<main class="content">
  <p class="eyebrow">From the trails</p>
  <h1>Community notes</h1>
  <p class="intro">Recent tips and questions shared by people exploring the park.</p>

  {#if data.comments.length}
    <div class="comment-list">
      {#each data.comments as comment}
        <article class="comment">
          <div class="comment-heading">
            <h2>{comment.name}</h2>
            {#if comment.created_at}
              <time datetime={new Date(comment.created_at).toISOString()}>
                {formatDate(comment.created_at)}
              </time>
            {/if}
          </div>
          <p>{comment.body}</p>
          <a href={`/posts/${comment.slug}#tips`}>
            {comment.trail_title} <span aria-hidden="true">→</span>
          </a>
        </article>
      {/each}
    </div>
  {:else}
    <p class="empty-state">There are no tips or questions yet. Visit a trail to share the first one.</p>
  {/if}
</main>

<style>
  .content {
    max-width: 860px;
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
  }

  h1 {
    margin: 0 0 8px;
    font-size: clamp(2.5rem, 7vw, 4rem);
    letter-spacing: -0.035em;
  }

  .intro {
    margin: 0 0 28px;
    color: var(--color-text-muted);
    font-size: 1.1rem;
  }

  .comment-list {
    display: grid;
    gap: 14px;
  }

  .comment {
    padding: 20px 22px;
    border: 1px solid var(--color-border);
    border-radius: 14px;
    background: var(--color-surface);
  }

  .comment-heading {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 16px;
  }

  .comment h2 {
    margin: 0 0 8px;
    font-family: inherit;
    font-size: 1.1rem;
    font-weight: 700;
  }

  time {
    color: var(--color-text-muted);
  }

  .comment > p {
    margin: 0 0 10px;
    white-space: pre-wrap;
  }

  .comment > a {
    color: var(--color-accent);
    font-weight: 700;
  }

  .comment > a:hover {
    text-decoration: underline;
    text-underline-offset: 4px;
  }

  .empty-state {
    padding: 22px;
    border: 1px solid var(--color-border);
    border-radius: 14px;
    background: var(--color-surface);
    color: var(--color-text-muted);
  }

  @media (max-width: 600px) {
    .content {
      padding: 44px 18px 56px;
    }

    .comment-heading {
      align-items: flex-start;
      flex-direction: column;
      gap: 0;
    }
  }
</style>
