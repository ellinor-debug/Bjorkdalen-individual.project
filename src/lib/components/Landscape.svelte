<svg
  class="landscape"
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 1440 360"
  preserveAspectRatio="xMidYMax slice"
  aria-hidden="true"
  focusable="false"
>
  <defs>
    <filter id="painted-haze" x="-5%" y="-8%" width="110%" height="116%">
      <feTurbulence type="fractalNoise" baseFrequency="0.012 0.035" numOctaves="2" seed="12" result="grain" />
      <feDisplacementMap in="SourceGraphic" in2="grain" scale="10" xChannelSelector="R" yChannelSelector="G" />
      <feGaussianBlur stdDeviation="3" />
    </filter>
    <filter id="painted-edge" x="-5%" y="-8%" width="110%" height="116%">
      <feTurbulence type="fractalNoise" baseFrequency="0.018 0.045" numOctaves="2" seed="5" result="grain" />
      <feDisplacementMap in="SourceGraphic" in2="grain" scale="5" xChannelSelector="R" yChannelSelector="G" />
    </filter>
    <linearGradient id="hill-mist" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f3efe6" stop-opacity="1" />
      <stop offset=".46" stop-color="#f3efe6" stop-opacity=".72" />
      <stop offset="1" stop-color="#f3efe6" stop-opacity="0" />
    </linearGradient>
    <g id="pine">
      <path d="M0 0 17 42 7 36 24 78 11 69 34 119 18 108 43 159 23 146 55 206H-55L-23 146-43 159-18 108-34 119-11 69-24 78-7 36-17 42Z" fill="#183d2d" />
      <path d="M0 8 9 43 2 38 16 77 5 69 25 119 12 108 34 158 18 146 43 206H-55L-23 146-43 158-18 108-34 119-12 69-25 77-11 38-18 43Z" fill="#245039" />
      <path d="M2 42 18 79 7 71 30 120 14 110 42 160 23 148 55 206H-18L-4 160-17 169 4 120-7 127 10 79 1 86Z" fill="#315d45" />
      <path d="M-7 201H7V270H-7Z" fill="#4a3b2a" />
      <path d="M-3 201H2V270H-3Z" fill="#72583c" opacity=".8" />
    </g>
    <g id="birch">
      <path d="M-10 26 0 0 10 26 7 67 11 113 6 172 9 236H-9L-6 172-11 113-7 67Z" fill="#e9e5d7" />
      <path d="M-4 46-10 52M5 76 10 82M-7 105-11 111M5 137 11 142M-6 167-10 172M4 197 9 202" fill="none" stroke="#334638" stroke-width="4" stroke-linecap="round" />
      <path d="M0 34-28 4M2 54 28 20M-2 76-31 50M3 92 32 63" fill="none" stroke="#3b5842" stroke-width="5" stroke-linecap="round" />
    </g>
  </defs>

  <!-- Back misty hills -->
  <path
    d="M0 146C150 102 245 154 390 130C540 102 625 149 765 129C920 103 1010 147 1148 118C1270 94 1360 137 1440 112V360H0Z"
    fill="#c6d1bc"
    opacity=".55"
    filter="url(#painted-haze)"
  />

  <!-- Distant rolling hills -->
  <path
    d="M0 182C140 141 260 192 405 165C560 137 680 190 825 163C980 135 1098 193 1235 162C1325 144 1390 165 1440 153V360H0Z"
    fill="#a9baa5"
    opacity=".56"
    filter="url(#painted-haze)"
  />

  <!-- Middle hills with faded tree silhouettes -->
  <path
    d="M0 224C135 183 270 237 420 206C575 175 700 229 850 200C1015 168 1125 229 1270 200C1350 184 1405 204 1440 192V360H0Z"
    fill="#829d88"
    opacity=".69"
    filter="url(#painted-edge)"
  />

  <!-- Foreground forest hill -->
  <path
    d="M0 274C150 236 285 283 440 257C590 232 722 281 875 255C1020 231 1165 278 1305 253C1365 242 1410 255 1440 247V360H0Z"
    fill="#315d45"
    filter="url(#painted-edge)"
  />

  <!-- Soft mist fades the distant hill layers into the cream page. -->
  <rect x="0" y="0" width="1440" height="282" fill="url(#hill-mist)" />

  <!-- Foreground trees at the left edge -->
  <g>
    <use href="#pine" transform="translate(44 82) scale(1.23)" />
    <use href="#pine" transform="translate(115 132) scale(.98)" />
    <use href="#birch" transform="translate(192 130) scale(.96)" />
    <use href="#pine" transform="translate(236 188) scale(.69)" />
  </g>

  <!-- Foreground trees at the right edge -->
  <g>
    <use href="#pine" transform="translate(1396 68) scale(1.35)" />
    <use href="#pine" transform="translate(1322 119) scale(1.02)" />
    <use href="#birch" transform="translate(1252 128) scale(.94)" />
    <use href="#pine" transform="translate(1200 182) scale(.72)" />
  </g>

  <!-- Small birds in the open sky -->
  <g fill="none" stroke="#647a68" stroke-linecap="round" stroke-width="3" opacity=".66">
    <path d="m1011 83q12-14 24 0 12-14 24 0" />
    <path d="m1101 115q9-11 18 0 9-11 18 0" />
    <path d="m944 126q7-9 14 0 7-9 14 0" />
  </g>

</svg>

<style>
  .landscape {
    display: block;
    width: 100%;
    height: 100%;
    margin-top: 0;
  }
</style>
