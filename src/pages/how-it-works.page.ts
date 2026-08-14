/**
 * src/pages/how-it-works.page.ts
 *
 * HowItWorksPage models the "How It Works" page, which also hosts the
 * "Product Specs" section (anchored at #product-specs) linked from the nav.
 */

import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import type { SiteConfig } from '@type-defs/site-config.types';

export class HowItWorksPage extends BasePage {
  private readonly path = '/how-it-works/';

  readonly heading: Locator;
  readonly productSpecsSection: Locator;
  readonly shopNowCta: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.heading = page.locator('h1').first();
    this.productSpecsSection = page.locator('#product-specs');
    this.shopNowCta = page.locator('a').filter({ hasText: /shop now/i }).first();
  }

  /** Navigate directly to /how-it-works/ (overrides BasePage.navigate, which goes to the site root). */
  async navigate(): Promise<void> {
    await this.page.goto(this.url.replace(/\/$/, '') + this.path, {
      waitUntil: 'domcontentloaded',
    });
  }

  /**
   * Return the trimmed text of every spec entry inside the Product Specs
   * section. The theme renders specs as icon+title+description blocks
   * (`h3.icon_title` / `h4`), not a `<ul><li>` list, so match on heading
   * tags generically and fall back to `<li>` for themes that do use a list.
   */
  async getProductSpecItems(): Promise<string[]> {
    if ((await this.productSpecsSection.count()) === 0) return [];

    const items = this.productSpecsSection.locator(
      '.icon_title, h3, h4, li'
    );
    const count = await items.count();
    const texts: string[] = [];

    for (let i = 0; i < count; i++) {
      const text = (await items.nth(i).textContent())?.trim();
      if (text) texts.push(text);
    }

    return texts;
  }
}
