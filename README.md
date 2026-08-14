# Hiji Band by Movement Interactive — QA Agentic Solution

Automated QA framework for [Hiji Band by Movement Interactive](https://www.hijiband.com/)
— a concussion-detection headband company based in Phoenix — built with
**Playwright + TypeScript**, the **Page Object Model (POM)**, and OOP
principles, and structured for agentic execution by Claude Code and other
coding agents.

---

## Purpose

This repo is a **regression test suite** for one live website
(`https://www.hijiband.com/`, configured in [`site.config.json`](./site.config.json)).
It exercises the site's GUI, navigation, forms, and business functionality
end-to-end at desktop, tablet, and mobile viewports — **without ever
creating an account or submitting a real form**.

Coverage is organized into six tagged categories, all runnable together as
the full regression suite:

| Tag | Covers |
|-----|--------|
| `@smoke` | Site loads, title present, no console errors |
| `@navigation` | Nav links, routing, menus, breadcrumbs |
| `@forms` | Form field presence/validation (never submission) |
| `@functional` | Business features — pricing, product info, media, accordions, etc. |
| `@visual` | Screenshot regression |
| `@responsive` | Layout correctness across viewports |

---

## Setting up your development environment

**Prerequisites:** Node.js 20+, Git.

```bash
git clone <this-repo-url>
cd hiji_band_by_movement_interactive_QA_Agentic_Solution

npm install
npx playwright install        # downloads browser binaries

cp .env.example .env          # optional: only needed to override SITE_URL
```

Verify the setup:

```bash
npx tsc --noEmit               # TypeScript strict-mode check
npm run lint                   # ESLint
npm run test:smoke             # quick end-to-end sanity check against the live site
```

### Running tests

```bash
npm test                       # full regression suite (every @tag)
npm run test:smoke             # @smoke only
npm run test:navigation        # @navigation only
npm run test:forms             # @forms only
npm run test:functional        # @functional only
npm run test:visual            # @visual only
npm run test:responsive        # @responsive only
npm run test:regression        # alias for `npm test`
npm run test:headed            # any of the above, headed (add --grep as needed)
npm run baseline               # recapture @visual screenshot baselines
npm run report                 # open the last HTML report
```

Tests run against the URL in `site.config.json` by default. Set `SITE_URL`
(env var or `.env`) to point at a different environment temporarily.

---

## Project structure

```
site.config.json           # site URL, name, and per-site test flags
playwright.config.ts       # projects: chromium-desktop, mobile-chrome, tablet
global-setup.ts            # pre-flight reachability check
src/
  pages/                   # Page Object Model classes (extend BasePage)
  fixtures/site.fixture.ts # custom Playwright fixtures (test/expect + page objects)
  utils/                   # link-checker, visual-helper
  types/                   # site-config.types.ts and other shared types
tests/
  smoke/        navigation/        forms/
  functional/   visual/            responsive/
.claude/
  agents/       # site-analyzer, test-generator subagents
  commands/     # /analyze-site, /generate-full-suite, /run-smoke, /update-baseline, /generate-report
  hooks/        # pre-test.sh (site reachability check, wired via settings.json)
.github/
  workflows/playwright.yml   # CI: typecheck, lint, full regression suite
  copilot-instructions.md
  CONTRIBUTING.md
  PULL_REQUEST_TEMPLATE.md
```

---

## Agentic tooling in this repo

This repo is set up to be driven by coding agents as much as by hand:

- **[`AGENTS.md`](./AGENTS.md)** — the tool-agnostic architecture/testing
  rules every agent (Claude Code, Copilot, Cursor, etc.) must follow.
- **[`CLAUDE.md`](./CLAUDE.md)** — Claude Code–specific wiring; imports
  `AGENTS.md` and adds subagent/hook/slash-command notes.
- **[`SKILLS.md`](./SKILLS.md)** — full reference for the slash commands
  and subagents under `.claude/`.
- **[`.github/copilot-instructions.md`](./.github/copilot-instructions.md)**
  — condensed rules for GitHub Copilot.

If you're asking an agent to add or update tests, point it at `AGENTS.md`
first — it covers the POM conventions, tagging rules, and the hard "do not"
list (no form submissions, no login, no assertions in page objects).

---

## Contributing

See [`.github/CONTRIBUTING.md`](./.github/CONTRIBUTING.md) for the full PR
workflow. Summary:

1. `npm install && npx playwright install`
2. Make your change (new/updated page object in `src/pages/`, tests in the
   matching `tests/<category>/` folder, tagged appropriately).
3. `npx tsc --noEmit && npm run lint && npm test`
4. Open a PR using the provided template. If you touched `@visual` tests,
   review any changed baseline screenshots before committing them.

### Hard rules

- Never submit a form or create an account against the live site.
- Never hardcode the site URL — always resolve it via Playwright's
  `baseURL`.
- No `expect()` assertions inside `src/pages/**` — only in `tests/**`.
- No `page.waitForTimeout()` — use `waitForSelector`/`waitForLoadState`.

---

*Automated QA framework generated as part of the Phoenix Startup QA
Agentic Solutions project.*
