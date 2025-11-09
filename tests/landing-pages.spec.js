// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Landing Pages', () => {

  test.describe('Home Page', () => {
    test('should load successfully', async ({ page }) => {
      await page.goto('/');
      await expect(page).toHaveTitle(/Lead Capture Platform/);
      await expect(page.locator('h1')).toContainText('Welcome to Our Platform');
    });

    test('should display all 6 landing page cards', async ({ page }) => {
      await page.goto('/');
      const cards = page.locator('.page-card');
      await expect(cards).toHaveCount(6);
    });

    test('should have links to all landing pages', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('a[href="/product-demo/"]')).toBeVisible();
      await expect(page.locator('a[href="/free-trial/"]')).toBeVisible();
      await expect(page.locator('a[href="/enterprise/"]')).toBeVisible();
      await expect(page.locator('a[href="/webinar/"]')).toBeVisible();
      await expect(page.locator('a[href="/free-guide/"]')).toBeVisible();
      await expect(page.locator('a[href="/sales-assessment/"]')).toBeVisible();
    });

    test('should have admin access link', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('a[href="/admin/"]')).toBeVisible();
    });
  });

  test.describe('Product Demo Page', () => {
    test('should load successfully', async ({ page }) => {
      await page.goto('/product-demo/');
      await expect(page).toHaveTitle(/Request a Product Demo/);
      await expect(page.locator('h1')).toContainText('Experience the Future of Sales');
    });

    test('should display features section', async ({ page }) => {
      await page.goto('/product-demo/');
      const features = page.locator('.feature-card');
      await expect(features).toHaveCount(3);
    });

    test('should have a lead capture form', async ({ page }) => {
      await page.goto('/product-demo/');
      await expect(page.locator('form')).toBeVisible();
      await expect(page.locator('input[name="name"]')).toBeVisible();
      await expect(page.locator('input[name="email"]')).toBeVisible();
      await expect(page.locator('input[name="company"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('form should have required fields', async ({ page }) => {
      await page.goto('/product-demo/');
      await expect(page.locator('input[name="name"]')).toHaveAttribute('required', '');
      await expect(page.locator('input[name="email"]')).toHaveAttribute('required', '');
    });
  });

  test.describe('Free Trial Page', () => {
    test('should load successfully', async ({ page }) => {
      await page.goto('/free-trial/');
      await expect(page).toHaveTitle(/Start Your Free Trial/);
      await expect(page.locator('h1')).toContainText('14-Day Free Trial');
    });

    test('should display 4 features', async ({ page }) => {
      await page.goto('/free-trial/');
      const features = page.locator('.feature-card');
      await expect(features).toHaveCount(4);
    });

    test('should have trial sign-up form', async ({ page }) => {
      await page.goto('/free-trial/');
      await expect(page.locator('input[name="first_name"]')).toBeVisible();
      await expect(page.locator('input[name="last_name"]')).toBeVisible();
      await expect(page.locator('input[name="email"]')).toBeVisible();
      await expect(page.locator('input[name="company"]')).toBeVisible();
      await expect(page.locator('input[name="phone"]')).toBeVisible();
    });
  });

  test.describe('Enterprise Page', () => {
    test('should load successfully', async ({ page }) => {
      await page.goto('/enterprise/');
      await expect(page).toHaveTitle(/Enterprise Solutions/);
      await expect(page.locator('h1')).toContainText('Enterprise-Grade Sales Platform');
    });

    test('should display 6 features', async ({ page }) => {
      await page.goto('/enterprise/');
      const features = page.locator('.feature-card');
      await expect(features).toHaveCount(6);
    });

    test('should have enterprise contact form', async ({ page }) => {
      await page.goto('/enterprise/');
      await expect(page.locator('input[name="name"]')).toBeVisible();
      await expect(page.locator('input[name="email"]')).toBeVisible();
      await expect(page.locator('input[name="job_title"]')).toBeVisible();
      await expect(page.locator('input[name="user_count"]')).toBeVisible();
    });
  });

  test.describe('Webinar Page', () => {
    test('should load successfully', async ({ page }) => {
      await page.goto('/webinar/');
      await expect(page).toHaveTitle(/Join Our Exclusive Webinar/);
      await expect(page.locator('h1')).toContainText('Master Sales in the Digital Age');
    });

    test('should display 6 features', async ({ page }) => {
      await page.goto('/webinar/');
      const features = page.locator('.feature-card');
      await expect(features).toHaveCount(6);
    });

    test('should have webinar registration form', async ({ page }) => {
      await page.goto('/webinar/');
      await expect(page.locator('input[name="first_name"]')).toBeVisible();
      await expect(page.locator('input[name="last_name"]')).toBeVisible();
      await expect(page.locator('input[name="email"]')).toBeVisible();
    });
  });

  test.describe('Free Guide Page', () => {
    test('should load successfully', async ({ page }) => {
      await page.goto('/free-guide/');
      await expect(page).toHaveTitle(/Download Free Sales Playbook/);
      await expect(page.locator('h1')).toContainText('The Ultimate Sales Playbook for 2024');
    });

    test('should display 6 features', async ({ page }) => {
      await page.goto('/free-guide/');
      const features = page.locator('.feature-card');
      await expect(features).toHaveCount(6);
    });

    test('should have download form', async ({ page }) => {
      await page.goto('/free-guide/');
      await expect(page.locator('input[name="name"]')).toBeVisible();
      await expect(page.locator('input[name="email"]')).toBeVisible();
    });
  });

  test.describe('Sales Assessment Page', () => {
    test('should load successfully', async ({ page }) => {
      await page.goto('/sales-assessment/');
      await expect(page).toHaveTitle(/Free Sales Process Assessment/);
      await expect(page.locator('h1')).toContainText('Discover Hidden Revenue');
    });

    test('should display 6 features', async ({ page }) => {
      await page.goto('/sales-assessment/');
      const features = page.locator('.feature-card');
      await expect(features).toHaveCount(6);
    });

    test('should have assessment request form with challenge field', async ({ page }) => {
      await page.goto('/sales-assessment/');
      await expect(page.locator('input[name="name"]')).toBeVisible();
      await expect(page.locator('input[name="email"]')).toBeVisible();
      await expect(page.locator('input[name="phone"]')).toBeVisible();
      await expect(page.locator('input[name="team_size"]')).toBeVisible();
      await expect(page.locator('textarea[name="challenge"]')).toBeVisible();
    });
  });

  test.describe('Form Functionality', () => {
    test('should validate email format on Product Demo form', async ({ page }) => {
      await page.goto('/product-demo/');

      await page.fill('input[name="name"]', 'Test User');
      await page.fill('input[name="email"]', 'invalid-email');
      await page.fill('input[name="company"]', 'Test Company');

      // Try to submit
      await page.click('button[type="submit"]');

      // Check for HTML5 validation
      const emailInput = page.locator('input[name="email"]');
      const validationMessage = await emailInput.evaluate((el) => el.validationMessage);
      expect(validationMessage).not.toBe('');
    });

    test('should have honeypot field for spam protection', async ({ page }) => {
      await page.goto('/product-demo/');
      const honeypot = page.locator('input[name="bot-field"]');
      await expect(honeypot).toBeHidden();
    });

    test('should have Netlify form attributes', async ({ page }) => {
      await page.goto('/product-demo/');
      const form = page.locator('form');
      await expect(form).toHaveAttribute('data-netlify', 'true');
      await expect(form).toHaveAttribute('method', 'POST');
    });
  });

  test.describe('Responsive Design', () => {
    test('should be mobile-friendly on iPhone', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('.page-card').first()).toBeVisible();
    });

    test('should be tablet-friendly on iPad', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/product-demo/');

      await expect(page.locator('form')).toBeVisible();
      await expect(page.locator('.feature-card').first()).toBeVisible();
    });
  });

  test.describe('Navigation', () => {
    test('should navigate from home to landing pages', async ({ page }) => {
      await page.goto('/');

      await page.click('a[href="/product-demo/"]');
      await expect(page).toHaveURL(/.*product-demo/);
      await expect(page.locator('h1')).toContainText('Experience the Future of Sales');
    });

    test('should have working admin link', async ({ page }) => {
      await page.goto('/');

      const adminLink = page.locator('a[href="/admin/"]');
      await expect(adminLink).toBeVisible();
      await expect(adminLink).toHaveText('Access Admin Panel');
    });
  });

  test.describe('SEO and Meta Tags', () => {
    test('Product Demo page should have meta description', async ({ page }) => {
      await page.goto('/product-demo/');
      const metaDescription = page.locator('meta[name="description"]');
      await expect(metaDescription).toHaveAttribute('content', /See our solution in action/);
    });

    test('Free Trial page should have meta description', async ({ page }) => {
      await page.goto('/free-trial/');
      const metaDescription = page.locator('meta[name="description"]');
      await expect(metaDescription).toHaveAttribute('content', /Try our platform free/);
    });
  });

  test.describe('Accessibility', () => {
    test('forms should have accessible labels', async ({ page }) => {
      await page.goto('/product-demo/');

      const nameLabel = page.locator('label[for="name"]');
      const emailLabel = page.locator('label[for="email"]');
      const companyLabel = page.locator('label[for="company"]');

      await expect(nameLabel).toBeVisible();
      await expect(emailLabel).toBeVisible();
      await expect(companyLabel).toBeVisible();
    });

    test('submit button should have descriptive text', async ({ page }) => {
      await page.goto('/product-demo/');
      const submitButton = page.locator('button[type="submit"]');
      await expect(submitButton).toContainText('Schedule My Demo');
    });
  });

  test.describe('Content Verification', () => {
    test('all pages should have footer', async ({ page }) => {
      const pages = [
        '/product-demo/',
        '/free-trial/',
        '/enterprise/',
        '/webinar/',
        '/free-guide/',
        '/sales-assessment/'
      ];

      for (const pagePath of pages) {
        await page.goto(pagePath);
        const footer = page.locator('.footer');
        await expect(footer).toBeVisible();
      }
    });

    test('CTA buttons should have clear text', async ({ page }) => {
      await page.goto('/free-trial/');
      const ctaButton = page.locator('button[type="submit"]');
      await expect(ctaButton).toContainText('Start Free Trial');

      await page.goto('/enterprise/');
      const enterpriseCta = page.locator('button[type="submit"]');
      await expect(enterpriseCta).toContainText('Contact Sales');
    });
  });
});
