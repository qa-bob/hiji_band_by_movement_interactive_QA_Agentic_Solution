/**
 * tests/functional/newsletter-signup.spec.ts
 *
 * Verifies the homepage newsletter/email-capture form is present and
 * structurally correct. IMPORTANT: does NOT submit the form or subscribe
 * a real email address.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Newsletter Signup @functional', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.waitForLoad();
  });

  test('newsletter signup form is present on the homepage @functional', async ({ homePage }) => {
    const hasForm = await homePage.hasNewsletterForm();
    expect(hasForm, 'Homepage should have a newsletter/email signup form').toBeTruthy();
  });

  test('newsletter form has an email field @functional', async ({ homePage }) => {
    const hasForm = await homePage.hasNewsletterForm();
    test.skip(!hasForm, 'No newsletter form found — covered by presence test');

    const hasEmail = await homePage.newsletterHasEmailField();
    expect(hasEmail, 'Newsletter form should have an email input').toBeTruthy();
  });

  test('newsletter form has a submit/subscribe control @functional', async ({ homePage }) => {
    const hasForm = await homePage.hasNewsletterForm();
    test.skip(!hasForm, 'No newsletter form found — covered by presence test');

    const hasSubmit = await homePage.newsletterHasSubmitControl();
    expect(hasSubmit, 'Newsletter form should have a submit/subscribe button').toBeTruthy();
  });
});
