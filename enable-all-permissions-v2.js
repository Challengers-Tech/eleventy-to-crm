#!/usr/bin/env node
/**
 * Enable ALL permissions - Updated based on DOM analysis
 * Sets all 130+ select elements to maximum permissions
 */

const { chromium } = require('playwright');

const ESPOCRM_URL = 'https://crm.challengers.tech';
const ADMIN_USERNAME = 'admin';
const ROLE_URL = 'https://crm.challengers.tech/#Role/view/6918a9ced1ea2d65f';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const adminPassword = process.argv[2];

  if (!adminPassword) {
    console.log('Usage: node enable-all-permissions-v2.js <admin-password>');
    process.exit(1);
  }

  console.log('\n🚀 Enabling ALL Administrator Permissions\n');

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage({ ignoreHTTPSErrors: true });

  try {
    // Login
    console.log('→ Logging in...');
    await page.goto(ESPOCRM_URL);
    await page.waitForSelector('input[name="username"]');
    await page.fill('input[name="username"]', ADMIN_USERNAME);
    await page.fill('input[name="password"]', adminPassword);
    await page.click('button[type="submit"]');
    await page.waitForSelector('.navbar', { timeout: 20000 });
    console.log('✓ Logged in\n');
    await sleep(3000);

    // Go to role
    console.log('→ Opening Administrator role...');
    await page.goto(ROLE_URL);
    await sleep(4000);

    // Click Edit
    console.log('→ Opening Edit mode...');
    const editButtons = await page.locator('button, a').all();
    for (const btn of editButtons) {
      const text = await btn.textContent();
      if (text && text.includes('Edit')) {
        await btn.click();
        break;
      }
    }
    await sleep(4000);
    console.log('✓ In edit mode\n');

    // Enable ALL permissions
    console.log('→ Setting ALL permissions to maximum...');

    const result = await page.evaluate(() => {
      const allSelects = document.querySelectorAll('select');
      let processed = 0;
      let changed = 0;

      allSelects.forEach(select => {
        processed++;
        const options = Array.from(select.options);

        // Skip if only 1 option (already set)
        if (options.length <= 1) return;

        // Priority: "all" > "yes" > "team" > "own"
        const priorities = ['all', 'yes', 'team', 'own'];
        let bestOption = null;

        for (const priority of priorities) {
          bestOption = options.find(opt =>
            opt.value === priority ||
            opt.text.toLowerCase() === priority
          );
          if (bestOption) break;
        }

        if (bestOption && select.value !== bestOption.value) {
          select.value = bestOption.value;
          select.dispatchEvent(new Event('change', { bubbles: true }));
          changed++;
        }
      });

      return { processed, changed };
    });

    console.log(`✓ Processed ${result.processed} permissions`);
    console.log(`✓ Changed ${result.changed} to maximum level\n`);

    // Save
    console.log('→ Saving...');
    await page.click('button.btn-primary, button:has-text("Save")');
    await sleep(4000);
    console.log('✓ Saved\n');

    // Assign to API user
    console.log('→ Assigning to landingz_on_netlify...');
    await page.goto(`${ESPOCRM_URL}/#Admin/apiUsers`);
    await sleep(3000);

    await page.click('text="landingz_on_netlify"');
    await sleep(2000);

    const editBtn = await page.locator('button, a').all();
    for (const btn of editBtn) {
      const text = await btn.textContent();
      if (text && text.includes('Edit')) {
        await btn.click();
        break;
      }
    }
    await sleep(2000);

    // Add role
    await page.click('div[data-name="roles"]');
    await sleep(1000);

    const adminRole = page.locator('li').filter({ hasText: 'Administrator' }).first();
    if (await adminRole.count() > 0) {
      await adminRole.click();
      console.log('✓ Administrator role selected');
    }
    await sleep(500);

    // Save
    await page.click('button:has-text("Save")');
    await sleep(4000);
    console.log('✓ Role assigned\n');

    // Test API
    console.log('→ Testing API access...');
    const response = await fetch(`${ESPOCRM_URL}/api/v1/Lead`, {
      headers: {
        'X-Api-Key': '1233741af7c2aff2c10da0c4fead9abf',
        'Content-Type': 'application/json',
      }
    });

    console.log(`API: ${response.status} ${response.statusText}\n`);

    if (response.ok) {
      console.log('╔════════════════════════════════════════╗');
      console.log('║  ✅ SUCCESS!                           ║');
      console.log('║  All permissions enabled!              ║');
      console.log('║                                        ║');
      console.log('║  Run integration tests:                ║');
      console.log('║  npx playwright test \\                 ║');
      console.log('║    --project=live-integration          ║');
      console.log('╚════════════════════════════════════════╝\n');
    } else {
      console.log('⚠ Still 403 - wait 1 minute and test again\n');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    await page.screenshot({ path: 'permissions-error.png' });
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
