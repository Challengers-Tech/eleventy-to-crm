// Quick manual test to verify forms submit correctly
const { test, expect } = require('@playwright/test');

test('Manual form submission test - Product Demo', async ({ page }) => {
  await page.goto('https://landingz.netlify.app/product-demo/');

  console.log('Filling out Product Demo form...');
  await page.fill('input[name="name"]', 'Manual Test User');
  await page.fill('input[name="email"]', `manual-test-${Date.now()}@example.com`);
  await page.fill('input[name="company"]', 'Test Company');
  await page.fill('input[name="phone"]', '+1 555-1234');

  console.log('Submitting form...');
  await page.click('button[type="submit"]');

  // Wait up to 30 seconds for redirect
  try {
    await page.waitForURL(/.*\/success/, { timeout: 30000 });
    console.log('✅ Form submitted successfully, redirected to success page');
    console.log('Current URL:', page.url());
  } catch (e) {
    console.log('❌ Form did not redirect to success page');
    console.log('Current URL:', page.url());
    console.log('Page content:', await page.content());
    throw e;
  }
});
