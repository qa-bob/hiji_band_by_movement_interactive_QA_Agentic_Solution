---
name: Bug report
about: A test is flaky, a selector broke, or the framework itself has a bug
title: "[bug] "
labels: bug
---

## What's broken

<!-- Which test/spec file, or which part of the framework (page object, fixture, config)? -->

## Expected vs. actual

<!-- What should happen vs. what actually happens -->

## Reproduction

```bash
npx playwright test <path/to/spec.ts> --grep "<test name>"
```

## Environment

- Site under test (from `site.config.json`): 
- Browser project (`chromium-desktop` / `mobile-chrome` / `tablet`): 
- Local or CI: 

## Relevant output / screenshot

<!-- Paste the failing assertion, or attach the trace/screenshot from playwright-report/ -->
