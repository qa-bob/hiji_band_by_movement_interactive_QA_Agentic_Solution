# AGENTS.md — QA Agentic Solution

This file follows the [AGENTS.md](https://agentskills.io) open convention for
giving coding agents persistent project instructions. It is tool-agnostic:
Claude Code, GitHub Copilot, Cursor, Codex, and any other agent working in
this repository should read and follow it. Tool-specific setup (subagents,
skills, hooks) lives in [`CLAUDE.md`](./CLAUDE.md) and [`SKILLS.md`](./SKILLS.md).

---

## Project Purpose

This repository is a **Playwright + TypeScript regression test suite** for
the single B2B website defined in `site.config.json` — currently
[Hiji Band by Movement Interactive](https://www.hijiband.com/). It follows a
**Page Object Model (POM)** architecture with standard **OOP** principles
(encapsulation, inheritance from a shared `BasePage`, single-responsibility
page classes).

Build and maintain a comprehensive GUI, functional, and regression test
suite that covers every discoverable feature of the site **without creating
accounts or submitting real forms**.

---

## Key Files

| File | Purpose |
|------|---------|
| `site.config.json` | Site URL, name, flags (`hasContactForm`, `skipVisual`, etc.) |
| `playwright.config.ts` | Playwright projects: desktop, mobile, tablet |
| `src/pages/` | Page Object Model classes, one per page or section |
| `src/fixtures/site.fixture.ts` | Custom Playwright fixtures exposing page objects |
| `src/utils/` | Helpers: link-checker, visual-helper |
| `src/types/` | TypeScript interfaces |
| `tests/smoke/` | `@smoke` — availability and basic load tests |
| `tests/navigation/` | `@navigation` — nav links, routing, menus |
| `tests/forms/` | `@forms` — form fields, validation (no submission) |
| `tests/functional/` | `@functional` — business logic, user flows |
| `tests/visual/` | `@visual` — screenshot regression |
| `tests/responsive/` | `@responsive` — layout at mobile/tablet/desktop |

---

## Architecture Rules

### Page Object Model (POM) + OOP

- Every page or major section has its own class in `src/pages/`.
- Page classes **extend `BasePage`** (`src/pages/base.page.ts`) — reuse its
  navigation, load-state, and element-discovery helpers instead of
  duplicating them.
- Locators are `readonly Locator` properties (or lazily resolved via a
  private getter when they depend on runtime state).
- Methods represent **user actions** (`clickPrimaryNav()`, `fillForm()`,
  `openMobileMenu()`), not assertions.
- **No `expect()` calls inside page objects** — assertions belong in tests
  only. Page objects return data/booleans; tests decide pass/fail.
- Favor resilient, role-based/semantic selectors (`getByRole`, `nav a[href]`,
  `[data-testid]`) over brittle CSS class matches, since this is a live
  third-party site that can change its markup.

### Tests

- Import page objects via the custom fixture in `src/fixtures/site.fixture.ts`
  (`import { test, expect } from '@fixtures/site.fixture'`) — do not
  construct page objects manually in test files.
- Tag every test with at least one of: `@smoke`, `@navigation`, `@forms`,
  `@functional`, `@visual`, `@responsive`.
- Do not hardcode the site URL in tests — always resolve it via `baseURL`
  (from `playwright.config.ts`, which reads `site.config.json`).
- **Never submit forms.** Test field presence, validation, and accessibility
  only — do not click the final submit button.
- **Never create accounts, log in, or enter real credentials** unless
  `auth.required: true` is explicitly set in `site.config.json`.
- Do not use `page.waitForTimeout()` — use `waitForSelector`,
  `waitForLoadState`, or Playwright's built-in auto-waiting instead.
- Each test must be independent and runnable in isolation (no shared
  mutable state between tests).

### TypeScript

- Strict mode is enabled (`tsconfig.json`) — no implicit `any`.
- All page object properties must be explicitly typed.
- Run `npx tsc --noEmit` before finishing any change.

---

## When Asked to Write or Update Tests

1. Read `site.config.json` first to get the URL and all flags.
2. Inspect the **live site** before writing any selectors — do not guess
   markup or use generic placeholder selectors.
3. Create or update the relevant page object class in `src/pages/`.
4. Write tests that call page object methods — avoid raw `page.locator()`
   calls in the test body.
5. Add/update the `@tag` on every test per the tagging reference below.
6. Run `npx tsc --noEmit` to verify TypeScript compiles cleanly.
7. Run the relevant `npm run test:*` script to confirm the new tests pass
   against the live site before considering the work done.

---

## Test Tagging Reference

| Tag | When to use |
|-----|-------------|
| `@smoke` | Site loads, title present, no console errors |
| `@navigation` | Nav links, routing, menus, breadcrumbs |
| `@forms` | Form fields, validation, accessibility |
| `@functional` | Business features: pricing, search, video, accordion |
| `@visual` | Screenshot regression with `toHaveScreenshot()` |
| `@responsive` | Viewport-specific layout checks |

The full suite (all tags together) is the **regression suite** — run with
`npm test` or `npm run test:regression`.

---

## Project Structure

```
site.config.json
playwright.config.ts
src/
  pages/
    base.page.ts          # BasePage base class
    home.page.ts          # HomePage (incl. newsletter signup helpers)
    navigation.page.ts    # NavigationPage
    contact.page.ts       # ContactFormPage
    how-it-works.page.ts  # HowItWorksPage (+ Product Specs section)
    shop.page.ts          # ShopPage (WooCommerce — read-only, no cart/checkout)
    <discovered>.page.ts  # One class per additional page
  fixtures/
    site.fixture.ts       # Custom test fixtures
  utils/
    link-checker.ts
    visual-helper.ts
  types/
    site-config.types.ts
tests/
  smoke/
    site-availability.spec.ts
  navigation/
    nav-links.spec.ts
  forms/
    contact-form.spec.ts
  functional/
    homepage-content.spec.ts
    how-it-works.spec.ts
    shop.spec.ts
    newsletter-signup.spec.ts
    <feature>.spec.ts     # One file per additional business feature area
  visual/
    visual-regression.spec.ts
  responsive/
    layout.spec.ts
```

---

## Do Not

- Submit any form.
- Create accounts or log in (unless `auth.required: true` in config).
- Hardcode the base URL in tests.
- Put assertions inside page object methods.
- Use `page.waitForTimeout()` — use `waitForSelector` or Playwright
  auto-waiting instead.
- Use `any` type without explicit justification.
- Add features, abstractions, or config beyond what a task requires.
