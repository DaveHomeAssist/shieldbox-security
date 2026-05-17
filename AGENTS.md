> **DEPRECATED** — This file is superseded by `CLAUDE.md`. Issues, session log, and project metadata now live in CLAUDE.md. This file is retained as a historical archive only.

# AGENTS.md

Inherits root rules from `/Users/daverobertson/Desktop/Code/AGENTS.md`.

## Project Overview

Static event security quote intake site for ShieldBox Security (Philadelphia). Users configure event details (type, size, billing, scope) and receive a quote estimate. The v4 gold master is a historical snapshot from the March 18 redesign. `index.html` is the canonical development file. The `archives/` directory contains previous iterations: v0 original, v1 gemini, v2 codex, v3 claude, v4 pre-audit snapshot.

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
- Archives directory preserves the build evolution across different AI tools

## Issue Tracker

| ID | Severity | Status | Title | Notes |
|----|----------|--------|-------|-------|
| — | — | — | See CLAUDE.md issue tracker | — |

## Session Log

[2026-03-18] [ShieldBox] [docs] Add AGENTS baseline
