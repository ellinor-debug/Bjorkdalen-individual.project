<script>
  /** @type {{ symbolCode: number | null, isNight?: boolean }} */
  let { symbolCode, isNight = false } = $props();

  let code = $derived(symbolCode ?? 6);
  let clear = $derived(code <= 2);
  let partlyCloudy = $derived(code === 3 || code === 4);
  let fog = $derived(code === 7);
  let shower = $derived(code >= 8 && code <= 10);
  let thunder = $derived(code === 11 || code === 21);
  let sleet = $derived((code >= 12 && code <= 14) || (code >= 22 && code <= 24));
  let snowShower = $derived(code >= 15 && code <= 17);
  let rain = $derived(code >= 18 && code <= 20);
  let snow = $derived(code >= 25 && code <= 27);
  let showCloud = $derived(!clear);
  let showCelestial = $derived(clear || partlyCloudy || shower || snowShower);
  let showRain = $derived(shower || rain || sleet);
  let showSnow = $derived(sleet || snowShower || snow);
  let showSecondCloud = $derived(code === 6);
</script>

<svg class="weather-icon" viewBox="0 0 64 48" aria-hidden="true" focusable="false">
  {#if showCelestial}
    {#if isNight}
      <path
        class="celestial"
        d="M24 4a14 14 0 1 0 15 21A16 16 0 0 1 24 4Z"
        stroke="#2f3e46"
        stroke-width="2.5"
        stroke-linejoin="round"
      />
    {:else}
      <circle class="celestial" cx="25" cy="19" r="8" stroke="#2f3e46" stroke-width="2.5" />
      <g class="sun-rays" stroke="#2f3e46" stroke-width="2.5" stroke-linecap="round">
        <path d="M25 5V2M25 36v-3M11 19H8M42 19h-3M15 9l-2-2M37 31l-2-2M35 9l2-2M13 31l2-2" />
      </g>
    {/if}
  {/if}

  {#if showSecondCloud}
    <path
      class="cloud-fill"
      d="M27 27a8 8 0 0 1 15-3 6 6 0 1 1 1 12H28a4.5 4.5 0 0 1-1-9Z"
    />
    <path
      class="cloud-line"
      d="M27 27a8 8 0 0 1 15-3 6 6 0 1 1 1 12H28a4.5 4.5 0 0 1-1-9Z"
    />
  {/if}

  {#if showCloud}
    <path
      class="cloud-fill"
      d="M11 29a9 9 0 0 1 17-4 7 7 0 1 1 2 14H12a5.5 5.5 0 0 1-1-11Z"
    />
    <path
      class="cloud-line"
      d="M11 29a9 9 0 0 1 17-4 7 7 0 1 1 2 14H12a5.5 5.5 0 0 1-1-11Z"
    />
  {/if}

  {#if fog}
    <g class="detail-line">
      <path d="M15 36h35M11 41h31M21 46h29" />
    </g>
  {:else if thunder}
    <path class="lightning" d="m31 35-5 8h6l-2 5 9-10h-6l3-3Z" />
  {:else}
    {#if showRain}
      <g class="detail-line raindrops">
        {#if sleet}
          <path d="m17 42-2 4M50 42l-2 4" />
        {:else}
          <path d="m20 43-2 4M31 43l-2 4M42 43l-2 4M51 40l-2 4" />
        {/if}
      </g>
    {/if}
    {#if showSnow}
      <g class="detail-line snowflakes">
        {#if sleet}
          <path d="M31 42v5m-2.5-2.5h5m-4.3-1.8 3.6 3.6m0-3.6-3.6 3.6M42 42v5m-2.5-2.5h5m-4.3-1.8 3.6 3.6m0-3.6-3.6 3.6" />
        {:else}
          <path d="M19 43v5m-2.5-2.5h5m-4.3-1.8 3.6 3.6m0-3.6-3.6 3.6M34 43v5m-2.5-2.5h5m-4.3-1.8 3.6 3.6m0-3.6-3.6 3.6M49 43v5m-2.5-2.5h5m-4.3-1.8 3.6 3.6m0-3.6-3.6 3.6" />
        {/if}
      </g>
    {/if}
  {/if}
</svg>

<style>
  .weather-icon {
    display: block;
    width: 1em;
    height: 0.75em;
    overflow: visible;
  }

  .celestial {
    fill: #f6d743;
  }

  .cloud-fill {
    fill: #f8fafb;
  }

  .cloud-line,
  .detail-line {
    fill: none;
    stroke: #2f3e46;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 2.5;
  }

  .lightning {
    fill: #f6d743;
    stroke: #2f3e46;
    stroke-linejoin: round;
    stroke-width: 2;
  }
</style>
