# CLAUDE.md

Inherits root rules from `/Users/daverobertson/Desktop/Code/AGENTS.md`.

## Project Overview

Static mockup of an event security quote intake portal for ShieldBox Security (Philadelphia). Users configure event details (type, size, billing, scope) and receive a quote estimate. The v4 gold master is a historical snapshot from the March 18 redesign. `index.html` is the canonical development file. `event-quote-request.html` is a static read-only preview of a completed event brief, linked from `index.html`. It carries `noindex`/`nofollow`. The `archives/` directory contains previous iterations: v0 original, v1 gemini, v2 codex, v3 claude, plus `shieldbox-v4-pre-audit-snapshot.html` as the pre-audit v4 archive.

## Stack

- Static HTML + inline CSS + inline JS (single file index.html)
- Eight theme variants: default, editorial, slate, obsidian, arctic, midnight, concrete, parchment
- Token based design system documented in SCHEMA.md
- GitHub Pages hosting
- No build step, no bundler, no framework

## Key Decisions

- Single file architecture; all form logic, pricing, and styles inline
- Multi theme support via body[data-theme] attribute and CSS custom property overrides
- Full design token contract: components reference tokens, no hardcoded colors
- Archives directory preserves the build evolution across different AI tools, including the pre-audit v4 snapshot

## Documentation Maintenance

- **Issues**: Track in the issue tracker table below
- **Session log**: Append to `/Users/daverobertson/Desktop/Code/95-docs-personal/today.csv` after each meaningful change

## Issue Tracker

| ID | Severity | Status | Title | Notes |
|----|----------|--------|-------|-------|
| 001 | P1 | closed | Checkbox inputs lack name attributes | Already had names in current version |
| 002 | P1 | closed | No quote calculation engine | Already implemented via updateEstimate() |
| 003 | P1 | closed | Event duration field accepts any free text with no validation | Already type="number" with step/min/max; added helper text + colon warning |
| 004 | P1 | closed | Attendance input has no max bound | Already had max="10000"; added >5000 inline warning |
| 005 | P2 | closed | Color contrast fails WCAG AA on editorial, slate, obsidian, and concrete themes | ink-soft values already bumped in prior session |
| 006 | P2 | closed | Validation only runs on explicit button click, not on submit | Added form submit event listener with preventDefault + scroll to invalid |
| 007 | P2 | closed | Risk assessment grid is static despite auto-assessed label | Already reactive via updateEstimate() |
| 008 | P2 | closed | Billing row selection not keyboard accessible | Native radio inputs now carry state, with row-level click and keyboard delegation preserved |
| 009 | P0 | closed | XSS risk in theme swatch innerHTML | Replaced innerHTML with DOM API (createElement) |
| 010 | P0 | closed | Missing CSRF-like token on form submission | Added hidden _token input with crypto.getRandomValues hex |
| 011 | P1 | closed | Phone field has no format validation | Added pattern + title attributes |
| 012 | P1 | closed | Email lacks typo detection | Added Levenshtein blur check against common domains |
| 013 | P1 | closed | Event date allows past dates | Added dynamic min attribute set to today |
| 014 | P1 | closed | Form submission retry causes duplicates | Added 10s cooldown + 3s error re-enable delay |
| 015 | P2 | closed | Duration decimal vs HH:MM confusion | Added helper text + colon-format inline warning |
| 016 | P2 | closed | Attendance allows 10K+ without feedback | Added >5000 inline warning |
| 017 | P2 | closed | Risk labels stale until estimate touched | Already reactive (same as 007) |
| 018 | P2 | closed | No validation button loading state | Added aria-busy + text swap + disable during check |
| 019 | P3 | closed | Honeypot name _honey too obvious | Renamed to company_url with aria-hidden |
| 020 | P3 | closed | No submission rate limiting | Added 10s timestamp guard on submit |
| 021 | P3 | open | Theme not reset on new quote | Current `index.html` preserves the selected theme when starting a new quote |
| 022 | P2 | closed | No return visitor pre-fill | Added localStorage client data model with restore bar, 180-day TTL, dismiss state |
| 023 | P2 | closed | No scope suggestions based on attendance | Added auto-suggest badges on scope checkboxes triggered at 500+ and 1000+ guests |
| 024 | P2 | closed | No billing model guidance | Added "Best fit" tag on billing rows based on duration and attendance thresholds |
| 025 | P2 | closed | No contextual next-action after validation | Added dynamic next-prompt that directs user to billing or submit based on state |
| 026 | P3 | closed | No visual progress indicator | Added progress breadcrumb bar with 5 tracked steps and live completion dots |
| 027 | P3 | closed | Event date defaults to blank | Auto-defaults to next Saturday; respects existing min-date constraint |
| 028 | P1 | closed | innerHTML in syncNextPrompt — fragile XSS surface | Replaced with safe DOM construction (replaceChildren/createElement) |
| 029 | P1 | closed | Estimate formula broken for flat and per-guard billing | Flat uses fixed price; per-guard uses rate × shift × guards |
| 030 | P1 | closed | Alcohol and access risk floors stuck at MEDIUM | Added LOW branches; risk grid now reflects actual event profile |
| 031 | P1 | closed | Hash deep links don't scroll to target section | Added goToSection after expandQuoteDesk for non-quoteStart hashes |
| 032 | P1 | closed | 6 redesign tokens not overridden in light themes | Added per-theme overrides for all 6 tokens across all 7 non-default themes |
| 033 | P0 | closed | Theme panel dialog missing aria-modal and focus trap | Added aria-modal="true" and keyboard focus trap in openPanel/closePanel |
| 034 | P1 | closed | Conflicting ARIA on billing rows and theme swatches | Removed role="radio" from tr; removed role="option"/aria-pressed from swatch buttons |
| 035 | P2 | closed | 18 hardcoded font-family strings bypass token system | Defined --font-display/--font-body; replaced all hardcoded strings |
| 036 | P2 | closed | Dead CSS (.gallery-card-wide, .dock-secondary) | Removed all dead rules |
| 037 | P2 | closed | Duplicate event listeners causing double checkValidity | Merged anticipatory UX handlers into primary input/change listeners |
| 038 | P2 | closed | Service cards lack scope qualifiers | Added "Best for" one-liners to help prospects self-select |
| 039 | P2 | closed | Act 235 certification lacks context for visitors | Added tooltip explainer and expanded label text |
| 040 | P2 | closed | Service area not defined | Added counties to footer, expanded JSON-LD areaServed |
| 041 | P3 | closed | Footer email exposed to scrapers | Obfuscated with JS assembly at runtime |
| 042 | P3 | closed | CTA button text generic ("Request a Quote") | Changed to "Get a 24-Hour Security Proposal" / "Get a 24-Hour Proposal" |

## Session Log

[2026-03-18] [ShieldBox] [docs] Add AGENTS baseline
[2026-03-23] [ShieldBox] [audit] Full 21-issue audit; wrote fix-prompts.md
[2026-03-23] [ShieldBox] [fix] Executed all 5 phases: input hardening, submission security, a11y, XSS, email typo, theme reset
[2026-03-31] [ShieldBox] [feature] Anticipatory UX: 5 features — contact pre-fill, scope suggestions, billing fit tags, next-action prompt, progress breadcrumb
[2026-04-10] [ShieldBox] [docs] Clarify canonical files, archive naming, event brief preview status, and current issue tracker state
[2026-04-10] [ShieldBox] [fix] Full 61-item audit: JS logic, security, a11y, CSS tokens, themes, docs — phases 1-5
[2026-04-10] [ShieldBox] [feature] Content improvements: service scope qualifiers, Act 235 context, service area, CTA copy, email obfuscation
