/**
 * src/pages/shop.page.ts
 *
 * ShopPage models the WooCommerce shop landing page: product category
 * cards plus a "Featured Products" grid. It intentionally never adds
 * items to the cart or interacts with checkout — only read-only
 * inspection and in-page navigation.
 */

import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import type { SiteConfig } from '@type-defs/site-config.types';

export class ShopPage extends BasePage {
  private readonly path = '/shop/';

  readonly productCategoryCards: Locator;
  readonly productCards: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.productCategoryCards = page.locator('li.product-category');
    // WooCommerce also stamps category-loop <li> elements with the bare
    // "product" class, so scope to ".type-product" to exclude categories.
    this.productCards = page.locator('ul.products li.product.type-product');
  }

  /** Navigate directly to /shop/ (overrides BasePage.navigate, which goes to the site root). */
  async navigate(): Promise<void> {
    await this.page.goto(this.url.replace(/\/$/, '') + this.path, {
      waitUntil: 'domcontentloaded',
    });
  }

  async getProductCategoryCount(): Promise<number> {
    return this.productCategoryCards.count();
  }

  async getFeaturedProductCount(): Promise<number> {
    return this.productCards.count();
  }

  /** Return the trimmed names of every featured product card. */
  async getFeaturedProductNames(): Promise<string[]> {
    const count = await this.productCards.count();
    const names: string[] = [];

    for (let i = 0; i < count; i++) {
      const card = this.productCards.nth(i);
      const name = (
        await card
          .locator('h2, h3, h4, h5, h6, [itemprop="name"], .woocommerce-loop-product__title')
          .first()
          .textContent()
      )?.trim();
      if (name) names.push(name);
    }

    return names;
  }
}
