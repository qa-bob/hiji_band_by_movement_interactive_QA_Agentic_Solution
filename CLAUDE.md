@AGENTS.md

## Claude Code

The project-wide rules above apply to every agent working in this repo.
This section covers Claude Code–specific tooling. See [`SKILLS.md`](./SKILLS.md)
for full details on each command/subagent.

### Subagents (`.claude/agents/`)

| Agent | Use for |
|-------|---------|
| `site-analyzer` | Crawling a live site to (re)populate `site.config.json` |
| `test-generator` | Generating site-specific tests beyond the generic suites, written to `tests/custom/` |

### Slash commands (`.claude/commands/`)

| Command | Description |
|---------|-------------|
| `/generate-full-suite` | Analyze the website and generate complete POM + tests |
| `/analyze-site` | Inspect site structure and report pages, forms, and elements |
| `/run-smoke` | Run smoke tests and report results |
| `/update-baseline` | Refresh visual regression baselines |
| `/generate-report` | Generate a test results summary |

### Hooks (`.claude/hooks/`, wired in `.claude/settings.json`)

- `pre-test.sh` runs automatically before any Bash command matching
  `npm test`, `npm run test*`, or `npx playwright test*`. It checks that the
  site in `site.config.json` is reachable and warns (without blocking) if not.

### Site inspection

When asked to write or update tests, use the `WebFetch` tool to inspect the
live site's structure before writing selectors — see step 2 of
["When Asked to Write or Update Tests"](./AGENTS.md#when-asked-to-write-or-update-tests)
in AGENTS.md.

### Use `/init`-style hygiene

If this file or `AGENTS.md` drifts from the actual codebase, prefer updating
them over letting undocumented conventions accumulate — future sessions
(and other agents/tools) rely on them being accurate.
