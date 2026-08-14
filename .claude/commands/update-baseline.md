# /update-baseline

Capture new visual regression baseline screenshots after intentional design changes.

## Usage

```
/update-baseline
```

## What this command does

1. **Run** `npm run baseline` (which runs `playwright test --grep @visual --update-snapshots`).
2. **List all updated baseline files** by diffing the `__snapshots__/` directory against git:

```
Updated baselines (3 files):
  __snapshots__/tests/visual/visual-regression.spec.ts/homepage-desktop-chromium-desktop.png
  __snapshots__/tests/visual/visual-regression.spec.ts/homepage-mobile-mobile-chrome.png
  __snapshots__/tests/visual/visual-regression.spec.ts/homepage-tablet-tablet.png
```

3. **Remind** the user to review the new screenshots before committing:

```
IMPORTANT: Review the updated screenshots before committing.
  - Open each file in an image viewer to confirm changes are intentional.
  - git add __snapshots__/ only after visual review.
  - Committing unreviewed baselines defeats the purpose of visual regression.

To view diffs (if you have ImageMagick):
  for f in $(git diff --name-only __snapshots__/); do
    convert "$f" "$(git show HEAD:$f | ...)" +append diff-$f.png
  done
```

4. **Report any failures** during baseline capture (e.g., site unreachable, selector timeout).

## When to run this

- After a deliberate site redesign or content update
- After updating the framework's screenshot capture logic
- After changing viewport sizes in `playwright.config.ts`
- When onboarding a new company repo (first-time baseline capture)

## Notes

- Baselines are stored in `__snapshots__/`, which is **committed** to version control
  (not gitignored) so a fresh clone or CI run has something to compare against.
- Visual tests **fail** (not skip) the first time they run with no baseline — Playwright
  writes the actual screenshot as the new baseline and reports the test as failed on
  that same run. Run `/update-baseline` (or `npm run baseline`) once to establish
  baselines, review the PNGs, then subsequent runs compare against them normally.
- Cookie banners are automatically dismissed before capture (see `dismissCookieBanner`
  in `src/utils/visual-helper.ts`); animations are frozen via `animations: 'disabled'`.
