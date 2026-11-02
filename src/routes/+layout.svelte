<script>
  import { page } from '$app/state';
  import favicon from '#lib/assets/favicon.svg';
  import AuthControls from '../lib/components/AuthControls.svelte';
  import Landscape from '../lib/components/Landscape.svelte';

  /** @type {{ children: import('svelte').Snippet, data: { user: { id: string, username: string, role: 'admin' | 'member' } | null } }} */
  let { children, data } = $props();
  let menuOpen = $state(false);
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@500;600;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="site-shell">
  <div class="landscape-background" aria-hidden="true">
    <Landscape />
  </div>

  <header class="site-header">
    <div class="header-inner">
      <a class="brand" href="/" aria-label="Björkdalen National Park home">
        <span class="brand-name">Björkdalen</span>
        <span class="brand-tagline">Trails, forests and quiet lakes in Dalarna</span>
      </a>

      <button
        class="menu-toggle"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="main-navigation"
        onclick={() => (menuOpen = !menuOpen)}
      >
        <span class="menu-icon" aria-hidden="true">{menuOpen ? '×' : '☰'}</span>
        <span>{menuOpen ? 'Close menu' : 'Menu'}</span>
      </button>

      <nav id="main-navigation" class:open={menuOpen} aria-label="Main navigation">
        <a href="/about" onclick={() => (menuOpen = false)}>About the park</a>
        <a href="/community" onclick={() => (menuOpen = false)}>Community</a>
        <a href="/trails" onclick={() => (menuOpen = false)}>Trails</a>
        {#if data.user?.role === 'admin'}
          <a href="/admin" onclick={() => (menuOpen = false)}>Admin</a>
        {/if}
        <div class="header-auth"><AuthControls user={data.user} /></div>
      </nav>
    </div>
  </header>

  {#if page.url.pathname !== '/'}
    <a class="home-button" href="/" aria-label="Back to the home page">
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="m3 10 9-7 9 7M5.5 9v11h13V9M9 20v-6h6v6" />
      </svg>
      <span>Home</span>
    </a>
  {/if}

  <div class:has-home-button={page.url.pathname !== '/'} class="page-layer">
    {@render children()}
  </div>

  <footer class="site-footer">
    <p>Björkdalen National Park · Dalarna, Sweden</p>
    <p>Visitor centre: open daily 9–16 · Parking at Björkdalen entrance · Emergency: 112</p>
  </footer>
</div>

<style>
  :global(*) {
    box-sizing: border-box;
  }

  :global(html),
  :global(body) {
    max-width: 100%;
    overflow-x: clip;
  }

  :global(:root) {
    --color-page: #f3efe6;
    --color-surface: #fbf8f0;
    --color-surface-muted: #e5e9dd;
    --color-heading: #294536;
    --color-text: #303f34;
    --color-text-muted: #5c6e60;
    --color-accent: #55745c;
    --color-accent-hover: #3e5e47;
    --color-border: #d4d8ca;
    --color-focus: #829d78;
    --color-white: #fdfbf5;
    --color-header-divider: #d4d8ca;
    --color-header-outline: #9ead98;
    --color-shadow: rgb(41 69 54 / 12%);
    --color-danger: #8f332c;
    --color-danger-surface: #f2e2dc;
    --color-easy-bg: #dfe8d8;
    --color-easy-text: #355a3b;
    --color-medium-bg: #eee3ca;
    --color-medium-text: #73551d;
    --color-hard-bg: #eedbd7;
    --color-hard-text: #853b35;
    --color-very-easy-bg: #dcebd7;
    --color-very-easy-text: #416443;
    --color-extreme-bg: #3b3048;
    --color-extreme-text: #fbf8f0;
  }

  :global(body) {
    margin: 0;
    background: var(--color-page);
    color: var(--color-text);
    font-family: Inter, 'Segoe UI', sans-serif;
    font-size: 16px;
    line-height: 1.6;
  }

  .site-shell {
    position: relative;
    display: flex;
    min-height: 100vh;
    flex-direction: column;
    isolation: isolate;
    background: var(--color-page);
  }

  .landscape-background {
    position: absolute;
    z-index: 0;
    right: 0;
    bottom: 0;
    left: 0;
    height: clamp(300px, 29vw, 380px);
    overflow: hidden;
    pointer-events: none;
  }

  .page-layer {
    position: relative;
    z-index: 1;
    flex: 1;
  }

  .page-layer.has-home-button {
    padding-top: 54px;
  }

  .home-button {
    position: fixed;
    z-index: 10;
    top: 124px;
    left: 24px;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    border: 1px solid var(--color-border);
    border-radius: 999px;
    padding: 8px 13px;
    background: var(--color-page);
    box-shadow: 0 4px 12px var(--color-shadow);
    color: var(--color-heading);
    font-size: 0.9rem;
    font-weight: 650;
    line-height: 1.2;
    transition:
      background-color 140ms ease,
      box-shadow 140ms ease;
  }

  .home-button:hover {
    background: var(--color-surface-muted);
    box-shadow: 0 5px 14px var(--color-shadow);
  }

  .home-button:focus-visible {
    outline: 3px solid var(--color-focus);
    outline-offset: 3px;
  }

  .home-button svg {
    width: 18px;
    height: 18px;
    fill: none;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1.8;
  }

  :global(a) {
    color: inherit;
    text-decoration: none;
  }

  :global(a:focus-visible),
  :global(button:focus-visible),
  :global(input:focus-visible),
  :global(textarea:focus-visible),
  :global(summary:focus-visible) {
    outline: 3px solid var(--color-focus);
    outline-offset: 3px;
  }

  .site-header {
    position: relative;
    z-index: 100;
    background: var(--color-page);
    color: var(--color-heading);
  }

  .site-footer {
    position: relative;
    z-index: 1;
    display: flex;
    width: 100%;
    max-width: 1400px;
    justify-content: space-between;
    gap: 18px;
    margin: auto auto 0;
    padding: 24px 48px 18px;
    color: #f3efe6;
    text-shadow: 0 1px 3px rgb(15 39 27 / 45%);
    line-height: 1.4;
  }

  .site-footer p {
    margin: 0;
  }

  .header-inner {
    display: flex;
    width: 100%;
    min-height: 112px;
    align-items: center;
    justify-content: space-between;
    gap: 32px;
    padding: 14px 4vw 17px;
    border-bottom: 1px solid var(--color-border);
  }

  .brand {
    display: grid;
    justify-items: start;
    line-height: 1.1;
  }

  .brand-name {
    color: var(--color-heading);
    font-family: 'Dancing Script', cursive;
    font-size: clamp(2.6rem, 5vw, 3.8rem);
    font-weight: 600;
    letter-spacing: 0.01em;
  }

  .brand-tagline {
    margin-top: 3px;
    color: var(--color-text-muted);
    font-size: 0.95rem;
    letter-spacing: 0.015em;
  }

  nav {
    display: flex;
    align-items: center;
    gap: 28px;
  }

  nav > a {
    color: var(--color-text-muted);
    font-size: 1.125rem;
    font-weight: 550;
  }

  .header-auth :global(a),
  .header-auth :global(button),
  .header-auth :global(.username) {
    font-size: 1.125rem;
  }

  nav > a:hover,
  .header-auth :global(a:hover) {
    color: var(--color-heading);
    text-decoration: underline;
    text-underline-offset: 4px;
  }

  .header-auth {
    border-left: 1px solid var(--color-header-divider);
    padding-left: 18px;
  }

  .menu-toggle {
    display: none;
    align-items: center;
    gap: 8px;
    border: 1px solid var(--color-header-outline);
    border-radius: 8px;
    padding: 8px 11px;
    background: transparent;
    color: var(--color-heading);
    cursor: pointer;
    font: inherit;
  }

  .menu-icon {
    font-size: 1.15rem;
    line-height: 1;
  }

  @media (max-width: 760px) {
    .site-footer {
      padding: 24px 18px 18px;
    }

    .header-inner {
      min-height: 0;
      flex-wrap: wrap;
      gap: 8px 12px;
      padding: 12px 18px;
    }

    .site-header {
      z-index: 11;
    }

    .page-layer.has-home-button {
      padding-top: 52px;
    }

    .home-button {
      top: 106px;
      left: 18px;
      gap: 5px;
      padding: 6px 10px;
      font-size: 0.82rem;
    }

    .home-button svg {
      width: 16px;
      height: 16px;
    }

    .brand {
      min-width: 0;
      max-width: none;
      flex: 1 1 0;
    }

    .brand-name {
      font-size: clamp(1.9rem, 8vw, 2.35rem);
    }

    .brand-tagline {
      max-width: 100%;
      font-size: 0.78rem;
      line-height: 1.3;
    }

    .menu-toggle {
      display: inline-flex;
      min-height: 44px;
      flex: 0 0 auto;
    }

    nav {
      display: none;
      width: 100%;
      align-items: stretch;
      flex-direction: column;
      gap: 0;
      padding: 8px 0 10px;
    }

    nav.open {
      display: flex;
    }

    nav > a {
      display: flex;
      min-height: 44px;
      align-items: center;
      padding: 8px 0;
    }

    .header-auth {
      display: flex;
      min-height: 48px;
      align-items: center;
      flex-wrap: wrap;
      border-top: 1px solid var(--color-header-divider);
      border-left: 0;
      margin-top: 8px;
      padding: 14px 0 0;
    }

    .header-auth :global(.auth-links) {
      flex-wrap: wrap;
      gap: 8px 20px;
    }

    .header-auth :global(a),
    .header-auth :global(button) {
      display: inline-flex;
      min-height: 44px;
      align-items: center;
    }
  }

  @media (max-width: 520px) {
    .site-footer {
      align-items: flex-start;
      flex-direction: column;
      gap: 2px;
      padding-right: 18px;
      padding-left: 18px;
      font-size: 0.88rem;
      line-height: 1.5;
    }

    .home-button {
      max-width: calc(100vw - 36px);
    }

    .landscape-background {
      height: 190px;
    }

    .landscape-background :global(use[href="#pine"]),
    .landscape-background :global(use[href="#birch"]) {
      transform-box: fill-box;
      transform-origin: center bottom;
      scale: 0.72;
    }

    .home-button {
      top: 88px;
    }

    .site-shell:has(nav.open) .home-button {
      visibility: hidden;
    }
  }

  @media (max-width: 360px) {
    .header-inner {
      padding-right: 14px;
      padding-left: 14px;
    }

    .brand-tagline {
      font-size: 0.8rem;
    }

    .menu-toggle {
      gap: 6px;
      padding: 7px 9px;
    }
  }

  @media (max-width: 400px) {
    .brand-name {
      font-size: 1.9rem;
    }

    .brand-tagline {
      font-size: 0.82rem;
    }

    .menu-toggle {
      min-height: 44px;
    }
  }
</style>
