/**
 * src/pages/navigation.page.ts
 *
 * NavigationPage models the site's primary navigation.
 * Uses semantic role-based selectors and avoids site-specific class names.
 */

import { type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';

export interface NavLinkInfo {
  text: string;
  href: string;
}

export interface LinkCheckResult {
  url: string;
  status: number;
  ok: boolean;
}

export class NavigationPage extends BasePage {
  // ── Nav detection ────────────────────────────────────────────────────────────

  /**
   * Return all `<nav>` / `[role="navigation"]` elements on the page.
   * Sites commonly render a separate desktop nav and an off-canvas mobile
   * nav — both match this locator, but only one is visible at a time.
   */
  private getAllNavLocators(): Locator {
    return this.page.locator('nav, [role="navigation"]');
  }

  /**
   * Return the primary navigation locator: whichever `<nav>` /
   * `[role="navigation"]` element is currently visible, falling back to the
   * first one in DOM order if none are visible yet (e.g. before a mobile
   * menu toggle has been opened).
   */
  private async getNavLocator(): Promise<Locator> {
    const navs = this.getAllNavLocators();
    const count = await navs.count();
    for (let i = 0; i < count; i++) {
      if (await navs.nth(i).isVisible()) return navs.nth(i);
    }
    return navs.first();
  }

  /** Return true if any navigation element is visible on the page. */
  async isNavVisible(): Promise<boolean> {
    const navs = this.getAllNavLocators();
    const count = await navs.count();
    for (let i = 0; i < count; i++) {
      if (await navs.nth(i).isVisible()) return true;
    }
    return false;
  }

  // ── Nav links ────────────────────────────────────────────────────────────────

  /**
   * Return all links inside the primary navigation with their text and href.
   * Filters out empty hrefs and anchor-only links (#).
   */
  async getNavLinks(): Promise<NavLinkInfo[]> {
    const nav = await this.getNavLocator();
    if (await nav.count() === 0) return [];

    const links = nav.locator('a[href]');
    const count = await links.count();
    const results: NavLinkInfo[] = [];

    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      const text = ((await link.textContent()) ?? '').trim();
      const href = (await link.getAttribute('href')) ?? '';

      // Skip empty, anchor-only, or javascript: links
      if (!href || href === '#' || href.startsWith('javascript:')) continue;

      results.push({ text, href });
    }

    return results;
  }

  /**
   * Click a navigation item by its visible text.
   * Uses a case-insensitive partial match.
   */
  async clickNavItem(text: string): Promise<void> {
    const nav = await this.getNavLocator();
    const link = nav.getByRole('link', { name: text });
    await link.first().click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  // ── Mobile menu ──────────────────────────────────────────────────────────────

  /**
   * Return the mobile hamburger / menu toggle locator, or null if not found.
   * Searches for common patterns: button with aria-label containing "menu",
   * elements with class containing "hamburger", "menu-toggle", "nav-toggle".
   */
  async getMobileMenuToggle(): Promise<Locator | null> {
    const candidates = [
      this.page.getByRole('button', { name: /menu|navigation|toggle|hamburger/i }),
      this.page.locator(
        '[class*="hamburger"], [class*="menu-toggle"], [class*="nav-toggle"], ' +
        '[class*="menu_toggle"], [class*="nav_toggle"], [class*="menu_button"], ' +
        '[class*="side_menu"]'
      ),
      this.page.locator('[aria-label*="menu" i], [aria-label*="navigation" i]').filter({ hasNotText: /^\s*$/ }),
      this.page.locator('button[aria-expanded]').first(),
    ];

    for (const candidate of candidates) {
      if (await candidate.count() > 0 && await candidate.first().isVisible()) {
        return candidate.first();
      }
    }

    return null;
  }

  /**
   * Open the mobile navigation menu if a toggle exists and the menu is currently closed.
   * No-op if no toggle is found (desktop layout).
   */
  async openMobileMenu(): Promise<void> {
    const toggle = await this.getMobileMenuToggle();
    if (!toggle) return;

    const isExpanded = await toggle.getAttribute('aria-expanded');
    if (isExpanded === 'true') return; // Already open

    await toggle.click();

    // Wait for any nav element to become visible (off-canvas menus animate in),
    // bounded so a site with no visible-nav follow-through doesn't hang the test.
    await this.page
      .waitForFunction(
        () =>
          Array.from(document.querySelectorAll('nav, [role="navigation"]')).some(
            (el) => (el as HTMLElement).offsetParent !== null
          ),
        { timeout: 2_000 }
      )
      .catch(() => {});
  }

  // ── Link reachability ────────────────────────────────────────────────────────

  /**
   * Check all nav links are reachable by issuing HEAD requests.
   * Returns an array of results with URL, HTTP status, and ok flag.
   * Relative URLs are resolved against config.url.
   */
  async checkAllNavLinksReachable(): Promise<LinkCheckResult[]> {
    const navLinks = await this.getNavLinks();
    const baseUrl = new URL(this.config.url);
    const results: LinkCheckResult[] = [];

    for (const link of navLinks) {
      let absoluteUrl: string;
      try {
        absoluteUrl = new URL(link.href, baseUrl).toString();
      } catch {
        results.push({ url: link.href, status: 0, ok: false });
        continue;
      }

      try {
        const response = await this.page.request.head(absoluteUrl, {
          timeout: 10_000,
        });
        results.push({
          url: absoluteUrl,
          status: response.status(),
          ok: response.ok(),
        });
      } catch {
        results.push({ url: absoluteUrl, status: 0, ok: false });
      }
    }

    return results;
  }
}
