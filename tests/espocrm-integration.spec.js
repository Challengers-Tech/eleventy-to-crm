// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');

// Load environment variables from .env.local
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

/**
 * EspoCRM Integration Tests
 *
 * These tests verify that form submissions from the landing pages
 * are correctly captured in the EspoCRM database at crm.challengers.tech
 *
 * Prerequisites:
 * 1. EspoCRM must be accessible at https://crm.challengers.tech
 * 2. Environment variables must be set for EspoCRM API access in .env.local:
 *    - ESPOCRM_API_KEY (or ESPOCRM_USERNAME/ESPOCRM_PASSWORD)
 *    - ESPOCRM_URL (defaults to https://crm.challengers.tech)
 */

const ESPOCRM_URL = process.env.ESPOCRM_URL || 'https://crm.challengers.tech';
const ESPOCRM_API_ENDPOINT = `${ESPOCRM_URL}/api/v1`;
const LANDING_PAGE_URL = process.env.LANDING_PAGE_URL || 'https://landingz.netlify.app';

/**
 * Helper function to authenticate with EspoCRM API
 */
async function getEspoCRMAuthHeaders() {
  const apiKey = process.env.ESPOCRM_API_KEY;
  const username = process.env.ESPOCRM_USERNAME;
  const password = process.env.ESPOCRM_PASSWORD;

  if (!apiKey && (!username || !password)) {
    throw new Error('EspoCRM credentials not configured. Set ESPOCRM_API_KEY or ESPOCRM_USERNAME/ESPOCRM_PASSWORD');
  }

  if (apiKey) {
    return {
      'X-Api-Key': apiKey,
      'Authorization': `ApiKey ${apiKey}`
    };
  } else {
    const credentials = Buffer.from(`${username}:${password}`).toString('base64');
    return {
      'Authorization': `Basic ${credentials}`
    };
  }
}

/**
 * Helper function to search for a lead in EspoCRM by email
 */
async function findLeadByEmail(email) {
  const authHeaders = await getEspoCRMAuthHeaders();

  const response = await fetch(`${ESPOCRM_API_ENDPOINT}/Lead?where[0][type]=equals&where[0][attribute]=emailAddress&where[0][value]=${encodeURIComponent(email)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to search leads: ${response.statusText}`);
  }

  const data = await response.json();
  return data.list && data.list.length > 0 ? data.list[0] : null;
}

/**
 * Helper function to delete a lead from EspoCRM (cleanup)
 */
async function deleteLead(leadId) {
  const authHeaders = await getEspoCRMAuthHeaders();

  const response = await fetch(`${ESPOCRM_API_ENDPOINT}/Lead/${leadId}`, {
    method: 'DELETE',
    headers: {
      ...authHeaders
    }
  });

  return response.ok;
}

test.describe('EspoCRM Integration', () => {

  test.describe('Product Demo Form Submission', () => {
    const testEmail = `test-demo-${Date.now()}@example.com`;
    let createdLeadId = null;

    test.afterAll(async () => {
      // Cleanup: Delete test lead from EspoCRM
      if (createdLeadId) {
        await deleteLead(createdLeadId);
        console.log(`Cleaned up test lead: ${createdLeadId}`);
      }
    });

    test('should submit form and create lead in EspoCRM', async ({ page }) => {
      // Navigate to the product demo page
      await page.goto(`${LANDING_PAGE_URL}/product-demo/`);

      // Fill out ALL required fields
      await page.fill('input[name="name"]', 'Test User Demo');
      await page.fill('input[name="email"]', testEmail);
      await page.fill('input[name="company"]', 'Test Company Inc');
      await page.fill('input[name="phone"]', '+1 555-0100');
      await page.fill('input[name="team_size"]', '10-50');

      // Submit the form
      await page.click('button[type="submit"]');

      // Wait for success page
      await page.waitForURL(/.*\/success/);

      // Verify "Thank You" message is displayed
      await expect(page.locator('h1')).toContainText('Thank You');
      await expect(page.locator('.success-content p')).toContainText('We\'ve received your information');

      // Wait for Netlify function to process (background function may take a few seconds)
      console.log('Waiting for background function to process...');
      await page.waitForTimeout(10000); // 10 seconds

      // Verify lead was created in EspoCRM
      const lead = await findLeadByEmail(testEmail);
      expect(lead).not.toBeNull();

      if (lead) {
        createdLeadId = lead.id;
        console.log(`Lead created with ID: ${lead.id}`);

        // Verify lead data
        expect(lead.firstName).toBe('Test');
        expect(lead.lastName).toBe('User Demo');
        expect(lead.emailAddress).toBe(testEmail);
        expect(lead.phoneNumber).toBe('+1 555-0100');
        expect(lead.accountName).toBe('Test Company Inc');
        expect(lead.source).toBe('Website');
        expect(lead.status).toBe('New');
      }
    });
  });

  test.describe('Free Trial Form Submission', () => {
    const testEmail = `test-trial-${Date.now()}@example.com`;
    let createdLeadId = null;

    test.afterAll(async () => {
      if (createdLeadId) {
        await deleteLead(createdLeadId);
        console.log(`Cleaned up test lead: ${createdLeadId}`);
      }
    });

    test('should submit form and create lead in EspoCRM', async ({ page }) => {
      await page.goto(`${LANDING_PAGE_URL}/free-trial/`);

      // Fill ALL required fields
      await page.fill('input[name="first_name"]', 'Jane');
      await page.fill('input[name="last_name"]', 'Doe');
      await page.fill('input[name="email"]', testEmail);
      await page.fill('input[name="company"]', 'Trial Corp');
      await page.fill('input[name="phone"]', '+1 555-0200'); // Required field!

      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/success/);

      // Verify "Thank You" message is displayed
      await expect(page.locator('h1')).toContainText('Thank You');
      await expect(page.locator('.success-content p')).toContainText('We\'ve received your information');

      console.log('Waiting for background function to process...');
      await page.waitForTimeout(10000);

      const lead = await findLeadByEmail(testEmail);
      expect(lead).not.toBeNull();

      if (lead) {
        createdLeadId = lead.id;
        console.log(`Lead created with ID: ${lead.id}`);

        expect(lead.firstName).toBe('Jane');
        expect(lead.lastName).toBe('Doe');
        expect(lead.emailAddress).toBe(testEmail);
        expect(lead.accountName).toBe('Trial Corp');
      }
    });
  });

  test.describe('Enterprise Form Submission', () => {
    const testEmail = `test-enterprise-${Date.now()}@example.com`;
    let createdLeadId = null;

    test.afterAll(async () => {
      if (createdLeadId) {
        await deleteLead(createdLeadId);
        console.log(`Cleaned up test lead: ${createdLeadId}`);
      }
    });

    test('should submit form and create lead in EspoCRM', async ({ page }) => {
      await page.goto(`${LANDING_PAGE_URL}/enterprise/`);

      // Fill ALL required fields
      await page.fill('input[name="name"]', 'Enterprise User');
      await page.fill('input[name="email"]', testEmail);
      await page.fill('input[name="company"]', 'Big Enterprise LLC');
      await page.fill('input[name="job_title"]', 'CTO');
      await page.fill('input[name="phone"]', '+1 555-0300'); // Required field!
      await page.fill('input[name="user_count"]', '500+');

      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/success/);

      // Verify "Thank You" message is displayed
      await expect(page.locator('h1')).toContainText('Thank You');
      await expect(page.locator('.success-content p')).toContainText('We\'ve received your information');

      console.log('Waiting for background function to process...');
      await page.waitForTimeout(10000);

      const lead = await findLeadByEmail(testEmail);
      expect(lead).not.toBeNull();

      if (lead) {
        createdLeadId = lead.id;
        console.log(`Lead created with ID: ${lead.id}`);

        expect(lead.firstName).toBe('Enterprise');
        expect(lead.lastName).toBe('User');
        expect(lead.emailAddress).toBe(testEmail);
        expect(lead.accountName).toBe('Big Enterprise LLC');
        expect(lead.title).toBe('CTO');
      }
    });
  });

  test.describe('Sales Assessment Form Submission', () => {
    const testEmail = `test-assessment-${Date.now()}@example.com`;
    let createdLeadId = null;

    test.afterAll(async () => {
      if (createdLeadId) {
        await deleteLead(createdLeadId);
        console.log(`Cleaned up test lead: ${createdLeadId}`);
      }
    });

    test('should submit form and create lead in EspoCRM', async ({ page }) => {
      await page.goto(`${LANDING_PAGE_URL}/sales-assessment/`);

      // Fill ALL required fields
      await page.fill('input[name="name"]', 'Assessment User');
      await page.fill('input[name="email"]', testEmail);
      await page.fill('input[name="company"]', 'Assessment Corp'); // Required field!
      await page.fill('input[name="job_title"]', 'VP of Sales'); // Required field!
      await page.fill('input[name="phone"]', '+1 555-0400');
      await page.fill('input[name="team_size"]', '20');
      await page.fill('textarea[name="challenge"]', 'We need to improve our sales process efficiency');

      await page.click('button[type="submit"]');
      await page.waitForURL(/.*\/success/);

      // Verify "Thank You" message is displayed
      await expect(page.locator('h1')).toContainText('Thank You');
      await expect(page.locator('.success-content p')).toContainText('We\'ve received your information');

      console.log('Waiting for background function to process...');
      await page.waitForTimeout(10000);

      const lead = await findLeadByEmail(testEmail);
      expect(lead).not.toBeNull();

      if (lead) {
        createdLeadId = lead.id;
        console.log(`Lead created with ID: ${lead.id}`);

        expect(lead.firstName).toBe('Assessment');
        expect(lead.lastName).toBe('User');
        expect(lead.emailAddress).toBe(testEmail);
        expect(lead.accountName).toBe('Assessment Corp');
        expect(lead.title).toBe('VP of Sales');
        expect(lead.description).toContain('improve our sales process');
      }
    });
  });
});
