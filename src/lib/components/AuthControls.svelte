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
  <a href="/login">Sign in</a>
{/if}

<style>
  :global(.auth-controls) {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .username {
    color: #62685f;
    font-size: 0.88rem;
  }

  button {
    border: 0;
    padding: 0;
    background: none;
    color: #3e6047;
    cursor: pointer;
    font: inherit;
    font-weight: 650;
  }

  a {
    color: #3e6047;
    font-weight: 650;
    text-decoration: none;
  }
</style>
