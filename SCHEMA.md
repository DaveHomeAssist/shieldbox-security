# ShieldBox Security — Design Schema

Extracted from the deployed pages: `index.html`, `quote.html`, and
`event-quote-request.html`.

---

## Head: Fonts (self-hosted)

All pages load fonts from the local stylesheet — never from Google's CDN:

```html
<link rel="stylesheet" href="css/fonts.css" />
```

`css/fonts.css` carries the `@font-face` declarations for Libre Baskerville
(400, 700) and Libre Franklin (300–700), pointing at woff2 files in `fonts/`.

> **Warning — do not reintroduce remote Google Fonts links.** Every page ships
> a Content Security Policy with `style-src 'self' 'unsafe-inline'` and
> `font-src 'self' data:`. A `fonts.googleapis.com` stylesheet is blocked by
> `style-src` and `fonts.gstatic.com` font files are blocked by `font-src`, so
> a remote link fails silently and drops the site to fallback fonts.

---

## Theme Contract

- Live theme: the default token set on `:root` in `css/shared.css`
  (`event-quote-request.html` re-declares its own tokens in its inline
  `<style>` block)
- **Dormant:** seven `body[data-theme="…"]` override blocks (editorial,
  slate, obsidian, arctic, midnight, concrete, parchment) remain in
  `css/shared.css`, and the event brief's inline CSS carries editorial and
  slate variants — but no shipped page sets `data-theme` to a non-empty
  value and the former theme-switcher UI no longer exists anywhere, so only
  the default theme can render
- Redesign tokens and motion tokens are also declared on `:root`

Every component references tokens only — never hard-coded colors.

---

## Token Override Skeleton

These blocks live at the top of `css/shared.css`. Only the `:root` set is
reachable today — the `body[data-theme="…"]` overrides are dormant (see
Theme Contract) but kept in sync here in case theme switching returns.

```css
:root {
  /* backgrounds */
  --bg: #0e1116;
  --surface: #151b24;
  --surface-2: #1b2430;
  --surface-3: #192332;

  /* borders */
  --line: #2d3949;
  --line-strong: #3d4c61;
  --panel-border: #3a4a5f;
  --field-border: #3a4a5f;
  --footer-divider: #3b4a5f;
  --gridline: rgba(255, 255, 255, 0.04);

  /* specialized */
  --field-bg: #1a2230;
  --billing-selected-bg: #232f3f;
  --billing-selected-border: #b76a44;
  --scope-selected-bg: #223044;
  --scope-selected-border: #5b6c83;
  --accent-strong: #f1cb86;

  /* ink */
  --ink: #e7edf6;
  --ink-soft: #b1bdd0;
  --label-ink: #c4cedf;

  /* accent + semantic */
  --accent: #b24b40;
  --accent-soft: rgba(178, 75, 64, 0.14);
  --ok: #4fa57f;
  --warn: #c99647;

  /* effects */
  --radius: 10px;
  --radius-sm: 12px;
  --radius-lg: 24px;
  --shadow-soft: 0 10px 28px rgba(0, 0, 0, 0.28);
  --panel-shadow: 0 24px 70px rgba(0, 0, 0, 0.32);

  /* motion */
  --motion-hover: 160ms;
  --motion-press: 90ms;
  --motion-feedback: 180ms;
  --motion-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --motion-ease-press: cubic-bezier(0.3, 0, 0.2, 1);
  --press-scale: 0.985;
  --press-scale-soft: 0.992;
  --hover-rise: -1px;

  /* type */
  --font-display: "Libre Baskerville", serif;
  --font-body: "Libre Franklin", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
}

body[data-theme="editorial"] {
  --bg: #f4f1eb;
  --surface: #ffffff;
  --surface-2: #f7f4ef;
  --ink: #1f1b17;
  --ink-soft: #565046;
  --label-ink: #60574d;
  --line: #d8d0c4;
  --line-strong: #baaea0;
  --panel-border: #d7d1c6;
  --field-bg: #fbfaf7;
  --field-border: #d7d1c6;
  --billing-selected-border: #a85734;
  --billing-selected-bg: #f8f3ef;
  --scope-selected-border: #ccbfae;
  --scope-selected-bg: #f8f3ef;
  --footer-divider: #e2dbd0;
  --accent: #8e3a30;
  --accent-soft: rgba(142, 58, 48, 0.1);
  --ok: #3d725e;
  --warn: #9d6f2b;
  --shadow-soft: 0 10px 24px rgba(26, 17, 12, 0.08);
}

body[data-theme="slate"] {
  --bg: #12151d;
  --surface: #1a212d;
  --surface-2: #212b3a;
  --ink: #e6ecf6;
  --ink-soft: #becbdf;
  --label-ink: #ccd7e8;
  --line: #314055;
  --line-strong: #3d506a;
  --panel-border: #41546e;
  --field-bg: #1e2939;
  --field-border: #41546e;
  --billing-selected-border: #5f7fa9;
  --billing-selected-bg: #233146;
  --scope-selected-border: #5f7fa9;
  --scope-selected-bg: #233146;
  --footer-divider: #4a5f7d;
  --accent: #2f5d9b;
  --accent-soft: rgba(47, 93, 155, 0.16);
  --ok: #4b9b83;
  --warn: #b7934b;
}

body[data-theme="obsidian"] {
  --bg: #0f0d0b;
  --surface: #1a1714;
  --surface-2: #23201b;
  --ink: #e8e2d8;
  --ink-soft: #c1b5a4;
  --label-ink: #d0c4b4;
  --line: #332e26;
  --line-strong: #4a4236;
  --panel-border: #443d33;
  --field-bg: #1c1915;
  --field-border: #443d33;
  --billing-selected-border: #c47a3a;
  --billing-selected-bg: #2a2318;
  --scope-selected-border: #8a7560;
  --scope-selected-bg: #2a2318;
  --footer-divider: #3d362c;
  --accent: #b56a2c;
  --accent-soft: rgba(181, 106, 44, 0.12);
  --ok: #5a9a6e;
  --warn: #c4943a;
  --shadow-soft: 0 10px 28px rgba(0, 0, 0, 0.4);
}

body[data-theme="arctic"] {
  --bg: #f5f7fa;
  --surface: #ffffff;
  --surface-2: #edf1f7;
  --ink: #141c2b;
  --ink-soft: #4d5c72;
  --label-ink: #5e6d82;
  --line: #d4dbe6;
  --line-strong: #b8c4d4;
  --panel-border: #cdd6e2;
  --field-bg: #f8fafe;
  --field-border: #cdd6e2;
  --billing-selected-border: #3a7cc0;
  --billing-selected-bg: #edf4fc;
  --scope-selected-border: #90b4d8;
  --scope-selected-bg: #edf4fc;
  --footer-divider: #dde3ec;
  --accent: #2b6aaa;
  --accent-soft: rgba(43, 106, 170, 0.08);
  --ok: #287a50;
  --warn: #9a7020;
  --shadow-soft: 0 8px 24px rgba(20, 28, 43, 0.06);
}

body[data-theme="midnight"] {
  --bg: #090d18;
  --surface: #101728;
  --surface-2: #172035;
  --ink: #e2e8f4;
  --ink-soft: #8a9bba;
  --label-ink: #9dadc8;
  --line: #1e2d48;
  --line-strong: #2c3f5e;
  --panel-border: #283a56;
  --field-bg: #0e1525;
  --field-border: #283a56;
  --billing-selected-border: #d4952e;
  --billing-selected-bg: #1a1e2e;
  --scope-selected-border: #5c7aaa;
  --scope-selected-bg: #141c30;
  --footer-divider: #253550;
  --accent: #cc8820;
  --accent-soft: rgba(204, 136, 32, 0.12);
  --ok: #38a070;
  --warn: #c49040;
  --shadow-soft: 0 10px 28px rgba(0, 0, 0, 0.45);
}

body[data-theme="concrete"] {
  --bg: #1a1c1e;
  --surface: #232628;
  --surface-2: #2c2f32;
  --ink: #dcdfe2;
  --ink-soft: #adb3b9;
  --label-ink: #bec3c8;
  --line: #363a3e;
  --line-strong: #484e54;
  --panel-border: #424850;
  --field-bg: #202325;
  --field-border: #424850;
  --billing-selected-border: #3a9a5c;
  --billing-selected-bg: #1e2c24;
  --scope-selected-border: #5a7a68;
  --scope-selected-bg: #1e2c24;
  --footer-divider: #3a3e42;
  --accent: #2e8a4e;
  --accent-soft: rgba(46, 138, 78, 0.10);
  --ok: #3a9a68;
  --warn: #c4943a;
  --shadow-soft: 0 10px 28px rgba(0, 0, 0, 0.35);
}

body[data-theme="parchment"] {
  --bg: #f0ebe0;
  --surface: #faf8f2;
  --surface-2: #f2ede4;
  --ink: #2a2018;
  --ink-soft: #6b5e4e;
  --label-ink: #7a6d5c;
  --line: #d8cfc0;
  --line-strong: #c4b8a4;
  --panel-border: #d0c6b6;
  --field-bg: #f7f4ec;
  --field-border: #d0c6b6;
  --billing-selected-border: #944030;
  --billing-selected-bg: #f4ede4;
  --scope-selected-border: #baa890;
  --scope-selected-bg: #f4ede4;
  --footer-divider: #ddd4c6;
  --accent: #7c2e22;
  --accent-soft: rgba(124, 46, 34, 0.08);
  --ok: #3a6e4e;
  --warn: #8a6420;
  --shadow-soft: 0 8px 20px rgba(42, 32, 24, 0.06);
}
```

## Motion Tokens

| Token | Value | Intended use |
|---|---|---|
| `--motion-hover` | `160ms` | Standard hover and preview transitions |
| `--motion-press` | `90ms` | Press-in state on buttons and interactive rows |
| `--motion-feedback` | `180ms` | Success/error confirmation feedback and tactile settle states |
| `--motion-ease` | `cubic-bezier(0.22, 1, 0.36, 1)` | Default exit/settle easing |
| `--motion-ease-press` | `cubic-bezier(0.3, 0, 0.2, 1)` | Press and error-response easing |
| `--press-scale` | `0.985` | Stronger press compression for primary actions |
| `--press-scale-soft` | `0.992` | Softer press compression for rows and utility controls |
| `--hover-rise` | `-1px` | Small lift on hover for tactile affordance |

## Redesign Tokens

| Token | Value | Intended use |
|---|---|---|
| `--accent-strong` | `#f1cb86` | High-emphasis accent text, highlight borders, and warm gradient peaks in the redesign surfaces |
| `--surface-3` | `#192332` | Deeper elevated panel background layered above `--surface-2` |
| `--panel-shadow` | `0 24px 70px rgba(0, 0, 0, 0.32)` | Large-form card and dashboard shadow treatment |
| `--radius-sm` | `12px` | Compact rounded corners on smaller panels and controls |
| `--radius-lg` | `24px` | Large rounded corners on hero cards, callouts, and major containers |
| `--gridline` | `rgba(255, 255, 255, 0.04)` | Subtle page-grid overlay lines in the redesigned background treatment |

---

## Page Shells (DOM order, per page)

### `index.html` — marketing home

```html
<body>
  <a class="skip-link" href="quote.html">Skip to quote request</a>

  <nav class="site-nav" aria-label="Main navigation">
    <!-- .nav-links + .nav-panel mobile disclosure -->
  </nav>

  <section class="landing"><div class="landing-grid">...</div></section>
  <section class="trust-strip" aria-label="ShieldBox service commitments">...</section>
  <section class="brand-story" aria-label="ShieldBox local credibility">...</section>
  <section class="gallery" aria-label="ShieldBox team in action">...</section>
  <section class="services" id="services">...</section>
  <section class="coverage-process" aria-labelledby="coverageProcessTitle">...</section>

  <div class="section-divider"><hr /></div>

  <section class="quote-cta-banner" id="quoteStart" aria-labelledby="quoteCtaTitle">...</section>

  <footer class="site-footer">...</footer>

  <div class="mobile-action-dock" aria-label="Quick mobile actions">...</div>
  <div id="toast" role="status" aria-atomic="true" hidden></div>

  <script src="js/nav.js" defer></script>
  <script><!-- page logic --></script>
</body>
```

### `quote.html` — intake form

```html
<body>
  <a class="skip-link" href="#intakeForm">Skip to intake form</a>

  <nav class="site-nav" aria-label="Main navigation">...</nav>

  <div class="quote-section quote-section-standalone" id="quoteStart">
    <div class="layout">
      <div class="stack">
        <!-- section cards, including
             <form id="intakeForm" class="intake-form" novalidate> -->
      </div>
      <aside class="side-stack" aria-label="Quick reference">
        <!-- sticky sidebar -->
      </aside>
    </div>
    <div class="submission-confirmation" id="submissionConfirmation" hidden aria-hidden="true" inert>...</div>
  </div>

  <footer class="site-footer">...</footer>

  <div id="toast" role="status" aria-live="polite" aria-atomic="true" hidden></div>

  <script src="js/nav.js" defer></script>
  <script><!-- form logic, pricing, submission --></script>
</body>
```

### `event-quote-request.html` — static event brief preview

```html
<body data-theme="">
  <a class="skip-link" href="#main-content">Skip to main content</a>

  <nav class="site-nav" aria-label="Site navigation">...</nav>

  <div class="shell">
    <nav class="sidebar" aria-label="Page sections">...</nav>
    <main class="main" id="main-content">...</main>
  </div>

  <footer class="site-footer"><div class="footer-inner">...</div></footer>

  <div id="toast" role="status" aria-live="polite" hidden></div>

  <script><!-- page logic (inline; this page has no js/nav.js) --></script>
</body>
```

---

## Component Inventory

### Page ownership

| Component group | `index.html` | `quote.html` | `event-quote-request.html` |
|---|---|---|---|
| `.site-nav` (+ `.nav-panel` mobile disclosure) | ✓ | ✓ | ✓ (variant with `.nav-sep`, no `.nav-panel`) |
| `.landing` / `.landing-grid` hero | ✓ | — | — |
| `.trust-strip` | ✓ | — | — |
| `.brand-story`, `.gallery` | ✓ | — | — |
| `.services` / `.services-grid` | ✓ | — | — |
| `.coverage-process` | ✓ | — | — |
| `.quote-cta-banner` | ✓ | — | — |
| `.mobile-action-dock` | ✓ | — | — |
| `.quote-section` / `.layout` / `.stack` / `.side-stack` | — | ✓ | — |
| `.intake-form` + validation/submission logic | — | ✓ | — |
| `.submission-confirmation` | — | ✓ | — |
| Section cards (`.section`, `.section-head`, `.property-grid`, `.check-grid`, `.risk-grid`, `.billing-table`, `.promise-card`, `.next-step`, `.simple-table`) | — | ✓ | ✓ (read-only variants) |
| `.shell` / `.sidebar` / `.main` dashboard frame | — | — | ✓ |
| `.site-footer` | ✓ | ✓ | ✓ (`.footer-inner` variant) |
| `#toast` | ✓ | ✓ | ✓ |

Stylesheet ownership: `css/fonts.css` loads on all three pages;
`css/shared.css` on `index.html` and `quote.html`; `css/marketing.css` on
`index.html` only; `css/quote-form.css` on `quote.html` only;
`event-quote-request.html` styles itself with an inline `<style>` block on top
of `css/fonts.css`. `js/nav.js` loads on `index.html` and `quote.html`.

```
GLOBAL
├─ :focus-visible         — 2px accent outline, 2px offset
├─ .skip-link             — keyboard-only skip nav
└─ color-mix()            — used throughout for dynamic tints

NAVIGATION
├─ .site-nav              — sticky top bar, blurred bg (56px)
│  ├─ .nav-brand          — shield SVG + .nav-wordmark
│  └─ .nav-links          — right-aligned
│     ├─ .nav-link-desktop — hidden ≤640px
│     └─ .nav-cta         — accent pill button

LANDING
├─ .landing               — full-viewport hero, centered
│  ├─ .hero-shield        — 72px SVG
│  ├─ .hero-tagline       — uppercase accent label
│  ├─ .hero-h1            — Baskerville, clamp(2.2rem–3.6rem)
│  ├─ .hero-sub           — light weight subtitle
│  └─ .hero-actions       — flex row
├─ .btn / .btn-primary / .btn-ghost

TRUST STRIP
└─ .trust-strip           — 5-col grid on index (marketing.css overrides the
   │                        4-col gap-trick base in shared.css)
   └─ .trust-item         — Baskerville numeral + label

SERVICES
└─ .services              — max-width:1080px
   └─ .services-grid      — 3-col → 1-col ≤980px
      └─ .svc-card        — icon + name + desc

QUOTE SECTION
├─ .quote-section         — max-width:1240px
└─ .layout                — 2-col grid; sidebar 320px on quote.html
                            (quote-form.css overrides the 292px shared.css base)
   ├─ .stack              — gap:22px content
   └─ .side-stack         — sticky sidebar
      └─ .side-card       — nav links / summary

SECTION CARDS
└─ .section               — bordered card, overflow:hidden
   ├─ .section-head       — surface-2 bar
   │  ├─ .section-icon    — 24px letter tag
   │  ├─ .section-title   — Baskerville
   │  └─ .section-note    — pill badge
   └─ .section-body

PROPERTY GRID
└─ .property-grid         — auto-fit, minmax(220px, 1fr)
   └─ .property           — .property-label + .property-value
└─ .notes-box             — .notes-title + .notes-copy

FORM
└─ .intake-form
   ├─ .form-grid          — 2-col → 1-col ≤980px
   │  └─ .form-field      — label + input
   ├─ .form-actions       — .tiny-action + .validation-msg
   └─ .core-fields → .core-chip

TABLE
└─ .simple-table-wrap → .simple-table (min-width:580px)

CHECKBOXES
└─ .check-grid → .check-item → .check-label + .check-copy
└─ .tip-box               — accent left-border callout

SCOPE (enhanced checkboxes)
└─ #scope .check-item     — :has(input:checked) states

RISK
├─ .risk-grid → .risk-item → .risk-name + .risk-level
│  Levels: .is-high / .is-medium / .is-low
└─ .recommend-box         — .recommend-title + .recommend-list
   └─ .recommend-row + .recommend-note

BILLING
├─ .billing-table-wrap → .billing-table (min-width:700px)
│  └─ .billing-row        — .is-selected highlight
│     ├─ .billing-model + .billing-desc
│     └─ .billing-choice  — radio + label
└─ .billing-note

PROMISE
└─ .promise-card          — .promise-title + .promise-lead
   + .promise-points + .promise-copy

NEXT STEP
└─ .next-step             — centered CTA block
   ├─ .next-title + .next-copy
   ├─ .next-actions → .cta / .cta-secondary
   └─ .next-turnaround

PILLS
└─ .pill                  — inline status indicator

FOOTER
└─ .site-footer           — .footer-brand + .footer-note

TOAST
└─ #toast → .show
```

---

## Implementation Notes

- `.layout` is a 2-col grid with a fixed sidebar (320px on `quote.html` via
  `css/quote-form.css`, overriding the 292px base in `css/shared.css`) until
  ≤980px, where the sidebar reflows below the content (`order: 2`).
- Scope selection uses `#scope .check-item:has(input:checked)` in
  `css/shared.css`. For wider browser support, add a JS class fallback.
- `color-mix(in srgb, ...)` is used throughout for dynamic tints — requires modern browser support.
- Print mode overrides the core tokens to light values and hides the nav,
  hero, trust strip, gallery, services, sidebar, CTA row, and toast (see
  Print section below).

---

## Responsive Breakpoints

| Breakpoint | Changes |
|---|---|
| ≤980px | Single column layout, sidebar reflows below content, risk/form/services grids collapse, trust strip drops to 2-col |
| ≤640px | Desktop nav links hidden (`.nav-panel` disclosure takes over), tighter paddings |

## Print

- Core tokens overridden to a light palette (`--bg`, `--surface`, `--surface-2`, `--ink`, `--ink-soft`, `--line`, `--line-strong`, `--accent`, `--accent-soft`, `--ok`, `--warn`)
- Hides: `.site-nav`, `.landing`, `.trust-strip`, `.gallery`, `.services`, `.section-divider`, `.quote-intro`, `.side-stack`, `.next-actions`, `#toast`
- `@page { margin: 14mm }`
- The identical print block ships in both `css/quote-form.css` and `css/marketing.css`
