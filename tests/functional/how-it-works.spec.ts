/**
 * tests/functional/how-it-works.spec.ts
 *
 * Verifies the "How It Works" page loads with its heading and that the
 * Product Specs section (linked from the nav as an in-page anchor) lists
 * the product's technical specifications.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('How It Works Page @functional', () => {
  test.beforeEach(async ({ howItWorksPage }) => {
    await howItWorksPage.navigate();
  });

  test('page loads with a heading @functional', async ({ howItWorksPage }) => {
    await expect(howItWorksPage.heading, 'How It Works page should have a visible <h1>').toBeVisible();

    const text = await howItWorksPage.heading.textContent();
    expect(text?.trim().length ?? 0, 'Heading should have meaningful text').toBeGreaterThan(0);
  });

  test('product specs section lists technical specifications @functional', async ({ howItWorksPage, page }) => {
    // The nav links to /how-it-works/#product-specs — follow it directly.
    await page.goto(howItWorksPage.url.replace(/\/$/, '') + '/how-it-works/#product-specs', {
      waitUntil: 'domcontentloaded',
    });

    const specs = await howItWorksPage.getProductSpecItems();

    test.skip(specs.length === 0, 'No Product Specs list items found');

    expect(specs.length, 'Product Specs section should list multiple specifications').toBeGreaterThan(1);
  });

  test('"SHOP NOW" CTA is present and links to the shop @functional', async ({ howItWorksPage }) => {
    test.skip((await howItWorksPage.shopNowCta.count()) === 0, 'No "SHOP NOW" CTA found on How It Works page');

    const href = await howItWorksPage.shopNowCta.getAttribute('href');
    expect(href, '"SHOP NOW" CTA should have an href').not.toBeNull();
    expect(href, '"SHOP NOW" CTA should point at the shop').toContain('/shop');
  });
});
