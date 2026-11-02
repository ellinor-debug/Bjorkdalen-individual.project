<script>
  /** @type {{ user: { id: string; username: string } | null }} */
  let { user } = $props();
</script>

{#if user}
  <span class="username">Signed in as {user.username}</span>
  <form action="/logout" method="POST">
    <button type="submit">Sign out</button>
  </form>
{:else}
  <div class="auth-links">
    <a href="/login">Sign in</a>
  </div>
{/if}

<style>
  :global(.auth-controls) {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .auth-links {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .username {
    color: var(--color-text-muted);
    font-size: 1rem;
  }

  button {
    border: 0;
    padding: 0;
    background: none;
    color: var(--color-accent);
    cursor: pointer;
    font: inherit;
    font-weight: 650;
  }

  a {
    color: var(--color-accent);
    font-weight: 650;
    text-decoration: none;
  }

  a:hover,
  button:hover {
    text-decoration: underline;
    text-underline-offset: 4px;
  }
</style>
