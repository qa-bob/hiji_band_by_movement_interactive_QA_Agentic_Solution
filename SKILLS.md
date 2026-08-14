# SKILLS.md — Agentic Tooling in This Repo

This repo ships two kinds of Claude Code extensions under `.claude/`:
**slash commands** (`.claude/commands/`) and **subagents** (`.claude/agents/`).
Both are loaded automatically — no installation step needed beyond having
Claude Code point at this repo.

> Claude Code has since merged "custom commands" into a broader **Skills**
> system (`.claude/skills/<name>/SKILL.md`). Files under `.claude/commands/`
> keep working exactly as before and still create a `/command-name`, so
> there's no urgency to migrate. See [Migrating to `.claude/skills/`](#migrating-to-claudeskills)
> if you want the extra features skills offer (bundled supporting files,
> auto-invocation without the user typing `/`, frontmatter-based access
> control).

---

## Slash commands (`.claude/commands/`)

Invoke these directly in a Claude Code session by typing the command name.

| Command | What it does |
|---------|---------------|
| `/analyze-site [url]` | Crawls the live site (or the URL in `site.config.json`), inspects nav/forms/headings/CTAs, and outputs a ready-to-paste `site.config.json` plus an issues checklist (missing meta description, broken nav links, missing `<h1>`, etc.). |
| `/generate-full-suite` | The big one. Reads `site.config.json`, discovers the site's pages/forms/interactive elements via `WebFetch`, writes/updates POM classes in `src/pages/`, and generates smoke/navigation/forms/functional/visual/responsive spec files. Runs `npx tsc --noEmit` at the end and reports a summary. |
| `/run-smoke` | Runs `npm run test:smoke`, parses `test-results/results.json`, and prints a pass/fail table with suggested fixes per failure type (HTTP errors, slow loads, console errors, missing HTTPS, etc.). |
| `/update-baseline` | Runs `npm run baseline` to recapture `@visual` screenshots, lists which baseline files changed, and reminds you to visually review them before committing. |
| `/generate-report` | Opens the Playwright HTML report and prints a structured per-tag summary (totals, pass/fail/flaky) plus full error detail for any failed or flaky tests. |

Full behavior and edge-case handling for each command is documented in its
own file — open `.claude/commands/<name>.md` for the complete spec.

---

## Subagents (`.claude/agents/`)

Subagents run in their own context window with a scoped tool list. Claude
Code delegates to them automatically when a task matches their
`description`, or you can ask for them by name.

| Agent | Role | Tools |
|-------|------|-------|
| `site-analyzer` | Crawls a live website end-to-end (dismissing cookie banners, following redirects, handling SPAs/auth-gates) and returns a fully-populated `site.config.json` plus a confidence assessment. Backs `/analyze-site`. | `WebFetch`, `Read`, `Write`, `Bash`, `Glob`, `Grep` |
| `test-generator` | Reads `site.config.json`, identifies coverage gaps against the generic suites, and writes new POM-based spec files to `tests/custom/` for site-specific functionality (pricing calculators, live chat, video embeds, etc.). Backs the "generate site-specific tests" part of `/generate-full-suite`. | `Read`, `Write`, `Edit`, `Glob`, `Grep`, `WebFetch`, `Bash` |

Both agent files start with YAML frontmatter (`name`, `description`,
`tools`, `model`) — this is required for Claude Code to register a markdown
file under `.claude/agents/` as a real subagent. If you add a new agent,
copy that frontmatter shape.

---

## Hooks (`.claude/hooks/`)

| Hook | Wired to | Purpose |
|------|----------|---------|
| `pre-test.sh` | `PreToolUse` on `Bash` commands matching `npm test*`, `npm run test*`, `npx playwright test*` (see `.claude/settings.json`) | Curls the site URL from `site.config.json` and warns (without blocking) if it's unreachable, so a red test run is easier to diagnose. |

---

## Migrating to `.claude/skills/`

If you want a command to gain a supporting-files directory, run in a
subagent by default, or be invoked automatically by Claude without the user
typing `/`, convert it to the Skills format:

```
.claude/skills/
  generate-full-suite/
    SKILL.md          # frontmatter: name, description, (optional) allowed-tools
    reference/         # optional supporting docs, scripts, templates
```

A command at `.claude/commands/generate-full-suite.md` and a skill at
`.claude/skills/generate-full-suite/SKILL.md` both create `/generate-full-suite`
and behave the same way for manual invocation — migrate opportunistically,
not as a blocking task.

---

## Related docs

- [`AGENTS.md`](./AGENTS.md) — project/testing rules every agent must follow
- [`CLAUDE.md`](./CLAUDE.md) — Claude Code–specific wiring (imports `AGENTS.md`)
- [`README.md`](./README.md) — repo purpose, setup, contributor workflow
