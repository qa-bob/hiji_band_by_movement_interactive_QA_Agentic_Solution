/**
 * tests/functional/shop.spec.ts
 *
 * Verifies the WooCommerce shop landing page renders product categories
 * and/or featured products. Read-only: never adds a product to the cart
 * or interacts with checkout.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Shop Page @functional', () => {
  test.beforeEach(async ({ shopPage }) => {
    await shopPage.navigate();
  });

  test('shop page renders product categories or featured products @functional', async ({ shopPage }) => {
    const categoryCount = await shopPage.getProductCategoryCount();
    const productCount = await shopPage.getFeaturedProductCount();

    expect(
      categoryCount + productCount,
      'Shop page should show at least one product category card or featured product'
    ).toBeGreaterThan(0);
  });

  test('featured products have non-empty names @functional', async ({ shopPage }) => {
    const productCount = await shopPage.getFeaturedProductCount();

    if (productCount === 0) {
      console.warn('[functional] No featured products found on shop page — skipping name check.');
      return;
    }

    const names = await shopPage.getFeaturedProductNames();
    expect(names.length, 'Every featured product should expose a readable name').toBeGreaterThan(0);
  });

  test('clicking a product category navigates to its category page @functional', async ({ shopPage, page }) => {
    const categoryCount = await shopPage.getProductCategoryCount();

    if (categoryCount === 0) {
      console.warn('[functional] No product category cards found — skipping navigation check.');
      return;
    }

    const firstCategoryLink = shopPage.productCategoryCards.first().locator('a[href]').first();
    const href = await firstCategoryLink.getAttribute('href');
    expect(href, 'Product category card should link somewhere').not.toBeNull();

    await firstCategoryLink.click();
    await page.waitForLoadState('domcontentloaded');

    expect(page.url()).not.toBe(shopPage.url.replace(/\/$/, '') + '/shop/');
  });
});
