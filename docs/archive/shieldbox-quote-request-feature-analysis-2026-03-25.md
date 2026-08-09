> **Historical document (March 2026), archived 2026-08-08.** Written against
> the single-file architecture that predates the August 2026 split into
> `css/` + `js/` and the separate `quote.html` form. Preserved for context
> only — do not use as current guidance.

# ShieldBox Quote Request — Feature Analysis

**Date:** 2026-03-25
**Project:** shieldbox-quote-request
**Stack:** Single-file static HTML + inline CSS + inline JS, GitHub Pages hosting

---

## Summary Table

| Feature | Status | Data Source / Persistence | Critical Gap |
|---|---|---|---|
| Multi-theme design system (8 themes) | Complete | CSS custom properties via `body[data-theme]`, localStorage | None — fully functional |
| Real-time quote estimation engine | Complete | In-memory JS calculation, no persistence | No backend — estimate is client-side only |
| Venue intelligence / auto-fill | Complete | Hardcoded venue profiles in JS | Static dataset; no API or admin panel to manage venues |
| Risk assessment matrix | Complete | Derived reactively from form inputs | Risk labels are illustrative, not actuarial |
| Multi-section intake form | Complete | DOM state only (no persistence across reloads) | Form data lost on page refresh |
| Email typo detection (Levenshtein) | Complete | Client-side JS | Only checks 7 common domains |
| Submission security (CSRF token, honeypot, rate limit) | Complete | crypto.getRandomValues, timestamp guard | No real backend to validate the token |
| Schema.org structured data | Complete | Inline JSON-LD in `<head>` | None |
| Accessibility (skip links, focus-visible, ARIA) | Complete | Native HTML/CSS/JS | ARIA roles on billing rows present but complex |
| Responsive layout with mobile dock | Complete | CSS media queries, mobile action dock | None |
| PDF download (print) | Complete | `window.print()` | No true PDF generation; relies on browser print |
| Submission confirmation flow | Complete | DOM swap via `.is-submitted` class | No actual email/backend delivery |
| Photo gallery section | Complete | Static `<img>` tags referencing BoxPics | None |

---

## Detailed Feature Analysis

### 1. Multi-Theme Design System (8 Themes)

**Problem it solves:** Lets prospects or internal users view the quote portal in a visual style that fits their preference or brand context — dark ops, editorial, slate, obsidian, arctic, midnight, concrete, parchment.

**Implementation:** Themes are declared as CSS custom property overrides on `body[data-theme]` (index.html lines 49-215). A fixed-position theme picker toggle (line 1006-1083) opens a swatch grid panel. Theme swatches are built via DOM API (not innerHTML) to avoid XSS (line 2951-2974). Selection persists to localStorage keyed by page path. The `applyTheme()` function (line 2976) sets or removes `data-theme` on `<body>`.

**Tradeoffs:** 8 themes means 8 sets of custom property values to maintain. Every new UI element must be tested across all themes. The token contract (documented in SCHEMA.md) mitigates this, but visual QA remains manual.

---

### 2. Real-Time Quote Estimation Engine

**Problem it solves:** Gives prospects an instant ballpark price before submitting, reducing friction and setting expectations.

**Implementation:** The `updateEstimate()` function (line ~3492-3568) computes a risk score from event type, attendance, setting, alcohol, VIP, ZIP code, and end time. Each factor adds weighted points. The score maps to risk tones (LOW/MEDIUM/HIGH/CRITICAL), which drive guard count ratios, hourly base rates, site lead costs, and a price range. A second function `updateQuoteAndRisk()` (line ~3570-3599) computes the sidebar summary estimate from billing model, duration, attendance, and scope selections.

**Tradeoffs:** All pricing logic is client-side and visible to anyone reading the source. The numbers are illustrative planning estimates. There is no backend to store or verify these values. The two estimation paths (Smart Quote Assist vs. sidebar summary) can produce different ranges since they use different calculation models.

---

### 3. Venue Intelligence / Auto-Fill

**Problem it solves:** Repeat clients or common Philadelphia venues get pre-populated form fields, reducing data entry and improving estimate accuracy.

**Implementation:** `lookupVenueProfile()` (line ~3400-3403) searches a hardcoded array of venue profiles by substring match. `fillFromVenue()` (line ~3405-3418) populates event type, setting, attendance, coverage hours, alcohol, VIP, ZIP, end time, and location fields. `renderVenueProfile()` (line ~3420-3435) shows a venue card with capacity, complexity, repeat/new pill, and a note.

**Tradeoffs:** The venue database is static JS — no way to add or update venues without editing source. The substring search is case-insensitive but has no fuzzy matching beyond exact includes.

---

### 4. Risk Assessment Matrix

**Problem it solves:** Visualizes security risk factors so the client understands why their quote is higher or lower.

**Implementation:** A 2-column grid of risk items (CSS class `.risk-grid`, lines 1509-1549) with pills colored by tone (`.is-high`, `.is-medium`, `.is-low`). Risk values are computed reactively in `updateEstimate()` — attendance risk, alcohol risk, crowd dynamics, VIP exposure, and venue complexity each get independent scores. A recommendation box shows guard count, ratio, price range, and review lane.

**Tradeoffs:** Risk labels are for communication, not actuarial precision. The scoring weights are tuned by hand, not calibrated against real incident data.

---

### 5. Submission Security

**Problem it solves:** Prevents spam, duplicate submissions, and basic bot attacks on the form.

**Implementation:** A hidden `_token` input populated with `crypto.getRandomValues` hex (CSRF-like). A renamed honeypot field `company_url` with `aria-hidden` and `tabindex="-1"`. A 10-second timestamp cooldown guard on submit to prevent rapid duplicates. The submit button gets `aria-busy`, text swap, and disable during validation.

**Tradeoffs:** Without a real backend, none of these tokens are actually validated server-side. They are defensive-in-depth measures for when a backend is eventually connected.

---

### 6. Email Typo Detection

**Problem it solves:** Catches common email domain typos (e.g., `gmial.com`) before submission.

**Implementation:** `syncEmailSuggestion()` (line ~3462-3489) splits the email at `@`, computes Levenshtein distance against 7 common domains (gmail, yahoo, outlook, hotmail, icloud, aol, protonmail), and if distance <= 2, shows a clickable suggestion button.

**Tradeoffs:** Only 7 domains covered. Custom or corporate domains will never trigger suggestions. The Levenshtein implementation is inline and O(n*m) but fine for short domain strings.

---

### 7. Responsive Layout with Mobile Adaptations

**Problem it solves:** Makes the portal usable on phones where event planners might access it from the field.

**Implementation:** Breakpoints at 980px (stack layout, sidebar reorders), 640px (2-col trust strip, horizontal nav scroll, 44px min touch targets, form input sizing), and 480px (hide desktop nav links, tighten hero). A mobile action dock (`.mobile-action-dock`) provides sticky bottom Preview and Submit buttons. All form inputs enforce min-height 44px for touch targets.

**Tradeoffs:** The billing table has `min-width: 700px` which causes horizontal scroll on mobile even after layout stacks. The theme picker panel needs careful positioning at small widths (handled with `@media (max-width: 400px)`).

---

### 8. Structured Data and SEO

**Problem it solves:** Improves search visibility for "Philadelphia event security" queries.

**Implementation:** JSON-LD (lines 22-44) declares `LocalBusiness` + `SecurityService` schema with name, description, URL, email, address, area served, service types, and price range. Open Graph and Twitter Card meta tags (lines 12-20) provide social sharing previews. A canonical URL and preconnect hints for Google Fonts round out the head.

**Tradeoffs:** No dynamic sitemap or robots.txt in the project root (though robots.txt exists as a separate file). The OG image points to a favicon PNG, not a branded social card.

---

## Top 3 Priorities

1. **Connect a real backend for form submission.** The entire intake flow ends at a simulated success screen. Hooking up an email relay (Netlify Forms, Formspree, or a simple serverless function) would make this production-ready overnight.

2. **Persist form state across page reloads.** A single `sessionStorage` or `localStorage` write on input change would prevent data loss if a user accidentally navigates away mid-form.

3. **Make the venue database editable.** Even a simple JSON file loaded at runtime (instead of hardcoded in the HTML) would let the ShieldBox team add new venues without touching source code.
