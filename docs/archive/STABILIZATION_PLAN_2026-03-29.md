> **Historical document (March 2026), archived 2026-08-08.** Written against
> the single-file architecture that predates the August 2026 split into
> `css/` + `js/` and the separate `quote.html` form. Preserved for context
> only — do not use as current guidance.

# ShieldBox Post-Redesign Stabilization Plan

## Current State

- The redesign pass is live and visually coherent on desktop and mobile.
- The blocking JavaScript boot error has been removed.
- The quote flow now boots cleanly, updates the live summary/risk modules, and reaches the confirmation state through the AJAX submit path.
- The removed estimate/venue-assist surface has been stripped from the live CSS and JS.
- The duplicated responsive logic has been consolidated into one canonical breakpoint set.
- The only remaining stabilization work is client-review content validation.

## Verified Blockers

### 1. Script crash on load

- Evidence:
  - resolved on March 30, 2026
  - local Playwright pageerror check now returns `[]`
- Impact:
  - no longer blocking
  - late-bound behaviors now initialize normally

### 2. Core quote flow is functionally degraded

- Evidence:
  - resolved on March 30, 2026
  - scripted checks now confirm:
    - no runtime errors
    - validation message populates
    - summary fields update from user input
    - mocked AJAX submit reaches confirmation state
    - `requestText: "Request Sent"`
- Impact:
  - no longer blocking
  - the primary intake flow is functional again

### 3. Removed estimate-assist surface still exists in code

- Evidence:
  - resolved on March 30, 2026
  - orphaned assist CSS, selectors, and DOM bindings were removed from the live file
- Impact:
  - maintenance surface is now aligned with the current UI
  - regression risk from the deleted assist subsystem is materially lower

### 4. Responsive rules are duplicated and partially conflicting

- Evidence:
  - resolved on March 30, 2026
  - the duplicated responsive blocks were merged into one tablet/phone rule set
- Impact:
  - no longer blocking
  - future responsive edits now land in one place instead of two competing sections

### 5. Client-facing content still needs confirmation

- Evidence:
  - known project constraints already note pending wording/image review
  - current redesign still uses:
    - `Since 2024`
    - `Insured · Act 235 · Owner-led`
    - Philadelphia-heavy geographic framing
- Impact:
  - design can ship visually while still carrying unverified sales claims or phrasing

## Phase Plan

### Phase 1. Functional Recovery

- Goal:
  - restore a working intake experience before any more design work
- Status:
  - complete on March 30, 2026
- Tasks:
  - remove or guard all references to removed estimate-assist DOM nodes
  - restore submit handler execution end-to-end
  - restore summary syncing, billing syncing, and reference generation
  - re-run submit-ready validation and confirmation-state checks
- Milestones:
  - no pageerror on boot
  - `Request Formal Proposal` triggers the live submit path
  - summary fields update from form input
  - billing and risk modules react after user changes
- Timeline:
  - completed same day
- Owner:
  - Codex

### Phase 2. Dead Code Removal

- Goal:
  - align the codebase with the current UI surface
- Status:
  - complete on March 30, 2026
- Tasks:
  - remove unused estimate-assist CSS and JS
  - delete stale `#instantEstimate` selectors and venue-profile plumbing
  - keep only the logic that maps to live DOM
- Milestones:
  - no orphaned selectors for removed sections
  - smaller, easier-to-read `index.html`
  - lower regression risk for next edits
- Timeline:
  - completed same day
- Owner:
  - Codex

### Phase 3. Responsive Consolidation

- Goal:
  - make mobile behavior deterministic and maintainable
- Status:
  - complete on March 30, 2026
- Tasks:
  - merge duplicated media-query logic
  - keep one canonical mobile/tablet rule set
  - verify nav, hero, gallery, cards, and final CTA at phone width
- Milestones:
  - no duplicated breakpoint sections for the same components
  - mobile layout remains intact after cleanup
- Timeline:
  - completed same day
- Owner:
  - Codex

### Phase 4. Client Review Prep

- Goal:
  - turn the stabilized build into a client-approval candidate
- Tasks:
  - confirm brand/legal wording with client
  - crop or replace the current field photos if requested
  - verify whether the long pre-form narrative is acceptable for the sales funnel
- Milestones:
  - approved wording for credentials and geography
  - approved imagery
  - approved conversion path on phone
- Timeline:
  - depends on client turnaround
- Owner:
  - Dave + client, with Codex implementing follow-up edits

## Recommended Next Move

- Move to Phase 4.
- Confirm client-facing wording, geography claims, and imagery before the next deploy or polish pass.
