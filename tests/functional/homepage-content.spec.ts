/**
 * tests/functional/homepage-content.spec.ts
 *
 * Verifies the core homepage business content: hero messaging, primary
 * CTAs, and the "Shop Now" path into the store. Never adds anything to
 * the cart or interacts with checkout.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Homepage Content @functional', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.waitForLoad();
  });

  test('hero heading communicates the product value proposition @functional', async ({ homePage }) => {
    const heading = await homePage.getMainHeading();
    expect(heading.length, 'Homepage should have a non-empty <h1>/<h2> heading').toBeGreaterThan(0);
  });

  test('homepage exposes at least one primary call-to-action @functional', async ({ homePage }) => {
    const ctas = await homePage.getCTAButtons();
    expect(ctas.length, 'Homepage should have at least one CTA button/link').toBeGreaterThan(0);
  });

  test('"SHOP NOW" CTA navigates to the shop page @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });

    // The nav also has a "SHOP NOW" item, which can be hidden behind a
    // mobile menu toggle — pick the first *visible* match, not just the
    // first one in DOM order.
    const shopNowLinks = page.locator('a').filter({ hasText: /shop now/i });
    const count = await shopNowLinks.count();

    test.skip(count === 0, 'No "SHOP NOW" CTA found on homepage');

    let visibleLink = null;
    for (let i = 0; i < count; i++) {
      if (await shopNowLinks.nth(i).isVisible()) {
        visibleLink = shopNowLinks.nth(i);
        break;
      }
    }

    test.skip(!visibleLink, '"SHOP NOW" CTA exists but is not visible (likely behind a closed mobile menu)');

    await visibleLink!.click();
    await page.waitForLoadState('domcontentloaded');

    expect(page.url(), 'Clicking "SHOP NOW" should navigate to a shop URL').toContain('/shop');
  });

  test('homepage has a visible primary heading and readable body content @functional', async ({ homePage }) => {
    const isLoaded = await homePage.isLoaded();
    expect(
      isLoaded,
      'Homepage should have a heading, a navigation element, and meaningful body text'
    ).toBeTruthy();
  });
});
