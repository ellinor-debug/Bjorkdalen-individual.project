<script>
  let { form } = $props();
</script>

<svelte:head>
  <title>Sign in — Björkdalen National Park</title>
</svelte:head>

<main class="content">
  <form method="POST" class="login-form">
    <p class="eyebrow">Welcome back</p>
    <h1>Sign in</h1>

    {#if form?.error}
      <p class="error" role="alert">{form.error}</p>
    {/if}

    <label for="username">Username</label>
    <input id="username" name="username" autocomplete="username" required maxlength="100" />

    <label for="password">Password</label>
    <input
      id="password"
      name="password"
      type="password"
      autocomplete="current-password"
      required
    />

    <button type="submit">Sign in</button>
    <p class="signup-link">New here? <a href="/signup">Create an account</a>.</p>
  </form>
</main>

<style>
  .content {
    max-width: 760px;
    margin: 0 auto;
    padding: 48px 28px 72px;
  }

  .login-form {
    display: grid;
    max-width: 440px;
    gap: 12px;
    margin: 24px auto;
    padding: 30px;
    border: 1px solid var(--color-border);
    border-radius: 18px;
    background: var(--color-surface);
  }

  .eyebrow {
    margin: 0;
    color: var(--color-accent);
    font-weight: 700;
  }

  h1 {
    margin: 0 0 12px;
    color: var(--color-heading);
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 2rem;
  }

  label {
    font-weight: 650;
  }

  input {
    min-height: 46px;
    padding: 9px 12px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-surface);
    color: var(--color-text);
    font: inherit;
  }

  button {
    min-height: 46px;
    margin-top: 12px;
    border: 0;
    border-radius: 999px;
    background: var(--color-accent);
    color: var(--color-white);
    cursor: pointer;
    font: inherit;
    font-weight: 650;
  }

  button:hover {
    background: var(--color-accent-hover);
  }

  .error {
    margin: 0;
    color: var(--color-danger);
  }

  .signup-link {
    margin: 0;
    color: var(--color-text-muted);
    text-align: center;
  }

  .signup-link a {
    color: var(--color-accent);
    font-weight: 700;
  }

  .signup-link a:hover {
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  @media (max-width: 520px) {
    .content {
      padding: 32px 18px 56px;
    }

    .login-form {
      padding: 22px;
    }
  }
</style>
