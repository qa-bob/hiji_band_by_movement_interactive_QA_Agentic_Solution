# GitHub Copilot Instructions

Full project rules live in [`AGENTS.md`](../AGENTS.md) at the repo root —
read it first. This file only restates the musts Copilot should never skip,
since Copilot does not follow `@file` imports the way Claude Code does.

## What this repo is

A Playwright + TypeScript **regression test suite** for the single website
in `site.config.json`, built with the **Page Object Model** and OOP. See
`AGENTS.md` for the full architecture rules, tagging reference, and project
structure.

## Non-negotiable rules

- **Never submit a form, create an account, or log in** (unless
  `site.config.json` sets `auth.required: true`).
- **No `expect()` inside page objects** (`src/pages/*.ts`) — assertions only
  belong in test files (`tests/**/*.spec.ts`).
- Page classes extend `BasePage` and use `readonly Locator` properties.
- Every test carries at least one tag: `@smoke`, `@navigation`, `@forms`,
  `@functional`, `@visual`, `@responsive`.
- Never hardcode the site URL — use `baseURL` from `playwright.config.ts`.
- No `page.waitForTimeout()` — use `waitForSelector`/`waitForLoadState`.
- TypeScript strict mode: no implicit `any`. Run `npx tsc --noEmit` before
  proposing a change is complete.
- Import test utilities from `@fixtures/site.fixture`, not raw
  `@playwright/test`.

## Before suggesting a PR is ready

Run: `npx tsc --noEmit && npm run lint && npm run test:smoke`
