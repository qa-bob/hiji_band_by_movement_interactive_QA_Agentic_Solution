# Contributing

This repo is a Playwright + TypeScript regression suite for the site in
`site.config.json`. Before contributing, read the root
[`README.md`](../README.md) for setup and [`AGENTS.md`](../AGENTS.md) for
the full architecture/testing rules — this file only covers the PR workflow.

## Setup

```bash
npm install
npx playwright install
cp .env.example .env   # fill in SITE_URL only if overriding site.config.json
```

## Before opening a PR

Run all of these locally and make sure they pass:

```bash
npx tsc --noEmit        # TypeScript strict-mode check
npm run lint            # ESLint
npm test                # Full regression suite (all @tags)
```

If you only touched one area, it's fine to iterate with the scoped script
(`npm run test:smoke`, `npm run test:forms`, etc.) but run the full suite
once before pushing.

## Rules that apply to every change

See [`AGENTS.md`](../AGENTS.md) for the complete list. The ones that matter
most for review:

- Never submit a real form or create an account against the live site.
- Assertions live in `tests/**`, never inside `src/pages/**`.
- Every test has a `@smoke` / `@navigation` / `@forms` / `@functional` /
  `@visual` / `@responsive` tag.
- New page-specific logic goes in a `src/pages/<name>.page.ts` class that
  extends `BasePage`, not inline in a spec file.

## Visual baselines

If your change is expected to alter a screenshot baseline (`@visual`
tests), run `/update-baseline` (or `npm run baseline`) and **visually
review** the diffed PNGs under `__snapshots__/` before committing them.
Never commit a baseline you haven't looked at.

## Commit / PR expectations

- Keep PRs scoped to one feature area or bug when possible (e.g., one PR
  per new page object + its specs).
- Describe *why* the change is needed in the PR description — the diff
  already shows *what* changed.
- Link the PR to any tracked issue it resolves.
