<script>
  import AuthControls from '../../lib/components/AuthControls.svelte';

  let { data, form } = $props();
</script>

<svelte:head>
  <title>Sign in — Prompt &amp; Practice</title>
</svelte:head>

<div class="page-shell">
  <header class="topbar">
    <a class="brand" href="/" aria-label="Prompt and Practice home">
      <span class="brand-mark">P</span>
      <span>Prompt &amp; Practice</span>
    </a>
    <div class="auth-controls">
      <AuthControls user={data.user} />
    </div>
  </header>

  <main>
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
    </form>
  </main>
</div>

<style>
  :global(*) {
    box-sizing: border-box;
  }

  :global(body) {
    margin: 0;
    background: #f7f6f2;
    color: #242a24;
    font-family: Inter, 'Segoe UI', sans-serif;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  a:focus-visible,
  button:focus-visible,
  input:focus-visible {
    outline: 3px solid #54785c;
    outline-offset: 4px;
  }

  .page-shell {
    max-width: 1100px;
    margin: 0 auto;
    padding: 28px;
  }

  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 8px 0 24px;
    border-bottom: 1px solid #dfded7;
  }

  .brand {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-weight: 700;
  }

  .brand-mark {
    display: grid;
    width: 32px;
    height: 32px;
    place-items: center;
    border-radius: 50%;
    background: #54785c;
    color: white;
  }

  .login-form {
    display: grid;
    max-width: 420px;
    gap: 12px;
    margin: 72px auto;
    padding: 30px;
    border: 1px solid #e4e2d9;
    border-radius: 18px;
    background: #fffefa;
  }

  .eyebrow {
    margin: 0;
    color: #54785c;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  h1 {
    margin: 0 0 12px;
    font-size: 2rem;
  }

  label {
    font-weight: 650;
  }

  input {
    min-height: 44px;
    padding: 8px 12px;
    border: 1px solid #cbc9c0;
    border-radius: 8px;
    font: inherit;
  }

  button {
    min-height: 46px;
    margin-top: 12px;
    border: 0;
    border-radius: 999px;
    background: #54785c;
    color: white;
    cursor: pointer;
    font: inherit;
    font-weight: 650;
  }

  button:hover {
    background: #3e6047;
  }

  .error {
    margin: 0;
    color: #a12828;
  }
</style>
