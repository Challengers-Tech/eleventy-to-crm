# Testing Guide

This project uses Playwright for automated end-to-end testing of all landing pages.

## Test Coverage

The test suite includes **36 comprehensive tests** covering:

### Functional Testing
- ✅ Page loading and rendering
- ✅ Form presence and functionality
- ✅ Required field validation
- ✅ Email format validation
- ✅ Netlify Forms integration
- ✅ Spam protection (honeypot fields)

### Content Verification
- ✅ Proper headings and titles
- ✅ Feature sections display correctly
- ✅ CTA buttons have clear text
- ✅ Footer appears on all pages
- ✅ Correct number of features per page

### Navigation Testing
- ✅ Home page links to all 6 landing pages
- ✅ Admin panel link is accessible
- ✅ Navigation between pages works correctly

### Responsive Design
- ✅ Mobile-friendly (iPhone 375x667)
- ✅ Tablet-friendly (iPad 768x1024)
- ✅ Desktop layout

### Accessibility
- ✅ Form labels are properly associated
- ✅ Submit buttons have descriptive text
- ✅ Semantic HTML structure

### SEO
- ✅ Meta descriptions present
- ✅ Page titles are correct
- ✅ Proper heading hierarchy

## Running Tests

### Prerequisites

Ensure you have installed all dependencies:

```bash
npm install
```

### Test Commands

**Run all tests (headless mode):**
```bash
npm test
```

**Run tests with browser UI visible:**
```bash
npm run test:headed
```

**Run tests in interactive UI mode:**
```bash
npm run test:ui
```

**View HTML test report:**
```bash
npm run test:report
```

## Test Results

All 36 tests pass successfully:

```
Running 36 tests using 8 workers
  36 passed (18.1s)
```

### Test Breakdown by Page

#### Home Page (4 tests)
- Page loads successfully
- Displays all 6 landing page cards
- Has links to all landing pages
- Has admin access link

#### Product Demo Page (4 tests)
- Loads successfully with correct title
- Displays 3 features
- Has lead capture form with all fields
- Form has required field validation

#### Free Trial Page (3 tests)
- Loads successfully
- Displays 4 features
- Has trial sign-up form with proper fields

#### Enterprise Page (3 tests)
- Loads successfully
- Displays 6 features
- Has enterprise contact form

#### Webinar Page (3 tests)
- Loads successfully
- Displays 6 features
- Has webinar registration form

#### Free Guide Page (3 tests)
- Loads successfully
- Displays 6 features
- Has download form

#### Sales Assessment Page (3 tests)
- Loads successfully
- Displays 6 features
- Has assessment request form with challenge textarea

#### Form Functionality (3 tests)
- Email validation works correctly
- Honeypot field is hidden
- Netlify form attributes are present

#### Responsive Design (2 tests)
- Mobile viewport (iPhone)
- Tablet viewport (iPad)

#### Navigation (2 tests)
- Navigate from home to landing pages
- Admin link is working

#### SEO and Meta Tags (2 tests)
- Product Demo meta description
- Free Trial meta description

#### Accessibility (2 tests)
- Forms have accessible labels
- Submit buttons have descriptive text

#### Content Verification (2 tests)
- All pages have footer
- CTA buttons have clear text

## Continuous Integration

### GitHub Actions

To run tests in CI/CD, add this workflow file:

**.github/workflows/test.yml**

```yaml
name: Playwright Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: 18

    - name: Install dependencies
      run: npm ci

    - name: Install Playwright Browsers
      run: npx playwright install --with-deps chromium

    - name: Run Playwright tests
      run: npm test

    - uses: actions/upload-artifact@v4
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

### Netlify Build Checks

You can also run tests during Netlify builds by updating your build command:

**netlify.toml**
```toml
[build]
  command = "npm run build && npm test"
  publish = "_site"
```

## Writing New Tests

### Test Structure

Tests are located in `tests/landing-pages.spec.js` and organized using Playwright's test structure:

```javascript
test.describe('Feature Group', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/page-url/');
    await expect(page.locator('selector')).toBeVisible();
  });
});
```

### Common Patterns

**Navigate to a page:**
```javascript
await page.goto('/product-demo/');
```

**Check page title:**
```javascript
await expect(page).toHaveTitle(/Expected Title/);
```

**Verify element is visible:**
```javascript
await expect(page.locator('.class-name')).toBeVisible();
```

**Count elements:**
```javascript
const features = page.locator('.feature-card');
await expect(features).toHaveCount(6);
```

**Fill out a form:**
```javascript
await page.fill('input[name="email"]', 'test@example.com');
await page.click('button[type="submit"]');
```

**Check for attributes:**
```javascript
await expect(page.locator('input[name="email"]')).toHaveAttribute('required', '');
```

## Debugging Tests

### Run Tests in Debug Mode

```bash
npx playwright test --debug
```

### Run Specific Test File

```bash
npx playwright test tests/landing-pages.spec.js
```

### Run Specific Test

```bash
npx playwright test -g "should load successfully"
```

### Take Screenshots

Screenshots are automatically captured on test failures. You can also manually capture:

```javascript
await page.screenshot({ path: 'screenshot.png' });
```

### View Trace Files

If a test fails, you can view the trace:

```bash
npx playwright show-trace trace.zip
```

## Best Practices

1. **Keep tests independent** - Each test should work in isolation
2. **Use meaningful test names** - Describe what is being tested
3. **Avoid hardcoding** - Use environment variables for URLs
4. **Test user workflows** - Not just individual elements
5. **Check accessibility** - Include ARIA labels and semantic HTML
6. **Test responsiveness** - Verify mobile, tablet, and desktop
7. **Validate forms** - Check required fields and validation
8. **Test error states** - Not just the happy path

## Performance Benchmarks

Average test execution times:
- Single page test: ~0.5s
- Form test: ~0.7s
- Navigation test: ~0.8s
- Full suite: ~18s

## Troubleshooting

### Tests Fail with "Port Already in Use"

The dev server might already be running. Stop it and run tests again:

```bash
# Kill existing process on port 8080
# Windows:
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:8080 | xargs kill
```

### Browser Not Found

Install Playwright browsers:

```bash
npx playwright install chromium
```

### Tests Timeout

Increase timeout in `playwright.config.js`:

```javascript
use: {
  timeout: 30000, // 30 seconds instead of default
}
```

## Further Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)
- [CI/CD Integration](https://playwright.dev/docs/ci)

## Test Maintenance

### When to Update Tests

- ✅ After adding new landing pages
- ✅ After changing form fields
- ✅ After modifying page layouts
- ✅ After updating navigation structure
- ✅ When SEO meta tags change

### Review Tests Regularly

Run the full test suite before:
- Creating pull requests
- Deploying to production
- Major refactoring
- Adding new features

## Coverage Goals

Current test coverage:
- ✅ 100% of landing pages tested
- ✅ 100% of forms tested
- ✅ All critical user journeys covered
- ✅ Responsive breakpoints verified
- ✅ Accessibility basics checked

Future enhancements:
- Visual regression testing
- Performance testing
- Load testing for forms
- Cross-browser testing (Firefox, Safari)
- Mobile device testing (real devices)

---

## EspoCRM Integration Testing

### Overview

In addition to the landing page tests above, this project includes **end-to-end integration tests** that verify form submissions are correctly captured in the EspoCRM database at https://crm.challengers.tech.

These tests:
1. Submit forms on the **live production site** (https://landingz.netlify.app)
2. Wait for Netlify background function to process
3. Query EspoCRM API to verify lead creation
4. Validate all lead data matches the submission
5. Automatically clean up test data

### Prerequisites for Integration Tests

#### 1. Install Playwright

```bash
npm install
npx playwright install
```

#### 2. Configure EspoCRM Credentials

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` with your EspoCRM credentials:

**Option 1: API Key (Recommended)**
```env
ESPOCRM_URL=https://crm.challengers.tech
ESPOCRM_API_KEY=your_actual_api_key_here
```

To generate an API key:
1. Log in to EspoCRM at https://crm.challengers.tech
2. Go to Administration → API Users
3. Create a new API user or edit existing
4. Generate an API key
5. Ensure the user has permissions: Lead (Create, Read, Edit, Delete)

**Option 2: Username/Password**
```env
ESPOCRM_URL=https://crm.challengers.tech
ESPOCRM_USERNAME=your_username
ESPOCRM_PASSWORD=your_password
```

**⚠️ Important**: Never commit `.env` to Git (it's already in `.gitignore`)

### Running Integration Tests

**Run all EspoCRM integration tests:**
```bash
npx playwright test --project=live-integration
```

**Run with visible browser:**
```bash
npx playwright test --project=live-integration --headed
```

**Run in debug mode:**
```bash
npx playwright test --project=live-integration --debug
```

**Run a specific form test:**
```bash
npx playwright test --project=live-integration -g "Product Demo"
```

### Forms Tested

The integration test suite covers all landing page forms:

- ✅ **Product Demo** (`/product-demo/`) - Name, email, company, phone, team size
- ✅ **Free Trial** (`/free-trial/`) - First name, last name, email, company, phone
- ✅ **Enterprise** (`/enterprise/`) - Name, email, company, job title, user count
- ✅ **Sales Assessment** (`/sales-assessment/`) - Name, email, phone, team size, challenge

### What Gets Verified

For each form submission, the tests verify:

1. ✅ Form submits successfully
2. ✅ User is redirected to success page
3. ✅ Lead is created in EspoCRM (via API query)
4. ✅ Lead data matches submitted form data
5. ✅ Lead has correct status ("New")
6. ✅ Lead has correct source ("Website")
7. ✅ Lead includes page name in sourceDescription

### Test Data Cleanup

Integration tests automatically clean up by deleting created leads after each test. Test leads use timestamped emails:

- `test-demo-{timestamp}@example.com`
- `test-trial-{timestamp}@example.com`
- `test-enterprise-{timestamp}@example.com`
- `test-assessment-{timestamp}@example.com`

If a test fails before cleanup, you may need to manually delete test leads from EspoCRM.

### Troubleshooting Integration Tests

#### "EspoCRM credentials not configured"

**Cause**: `.env` file is missing or doesn't contain credentials

**Solution**:
1. Create `.env` file: `cp .env.example .env`
2. Add your `ESPOCRM_API_KEY` or username/password
3. Verify the file is in the project root

#### "Failed to search leads: 401 Unauthorized"

**Cause**: Invalid API key or credentials

**Solution**:
1. Verify credentials in `.env` are correct
2. For API Key: Regenerate in EspoCRM → Administration → API Users
3. For Username/Password: Ensure password is correct
4. Test manually with curl:
```bash
curl -X GET "https://crm.challengers.tech/api/v1/Lead" \
  -H "X-Api-Key: your_api_key"
```

#### "Failed to search leads: 403 Forbidden"

**Cause**: API user lacks permissions

**Solution**:
1. Log in to EspoCRM as admin
2. Go to Administration → API Users (or Users)
3. Edit your API user
4. Grant permissions:
   - Lead: Create ✅
   - Lead: Read ✅
   - Lead: Edit ✅
   - Lead: Delete ✅
5. Save changes

#### "Test timeout - Lead not found"

**Cause**: Netlify background function not processing or environment variables not set in Netlify

**Solution**:
1. **Check Netlify Function Logs**:
   - Go to Netlify Dashboard → Functions
   - Click `submission-created`
   - View recent invocations
   - Look for errors

2. **Verify Netlify Environment Variables**:
   - Go to Netlify Dashboard → Site settings → Environment variables
   - Ensure these are set:
     - `ESPOCRM_URL=https://crm.challengers.tech`
     - `ESPOCRM_API_KEY=your_key` (or username/password)
   - If you just added them, **redeploy the site**

3. **Check EspoCRM API Access**:
   - Verify EspoCRM is accessible from Netlify's servers
   - Check CORS settings in EspoCRM
   - Verify no firewall blocking Netlify IPs

#### Form Submits But No Lead Created

**Debugging steps**:

1. **Manual Test**:
   ```bash
   # Submit a form manually at https://landingz.netlify.app/product-demo/
   # Wait 10-15 seconds
   # Log in to https://crm.challengers.tech
   # Check Leads module for new entry
   ```

2. **Check Netlify Function Logs**:
   - Look for "✅ Lead created successfully" or error messages
   - Verify function received the form data
   - Check authentication method being used

3. **Test EspoCRM API Directly**:
   ```javascript
   // Use browser console or Node.js
   fetch('https://crm.challengers.tech/api/v1/Lead', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'X-Api-Key': 'your_api_key'
     },
     body: JSON.stringify({
       firstName: 'Test',
       lastName: 'User',
       emailAddress: 'test@example.com',
       source: 'Website',
       status: 'New'
     })
   }).then(r => r.json()).then(console.log);
   ```

### Manual Verification Steps

To manually verify the integration works:

1. **Submit a form**:
   - Visit https://landingz.netlify.app/product-demo/
   - Fill out with test data
   - Submit

2. **Check Netlify Functions**:
   - Go to Netlify Dashboard
   - Functions → `submission-created`
   - Recent invocations
   - Look for success log

3. **Verify in EspoCRM**:
   - Log in to https://crm.challengers.tech
   - Navigate to Leads
   - Find the newly created lead
   - Verify all data matches your submission

4. **Check field mapping**:
   - `name` → `firstName` / `lastName`
   - `email` → `emailAddress`
   - `company` → `accountName`
   - `phone` → `phoneNumber`
   - Page name → `sourceDescription`
   - "Website" → `source`
   - "New" → `status`

### Best Practices

1. **Use a staging EspoCRM instance** if available for testing
2. **Don't run integration tests too frequently** - they create real data in CRM
3. **Monitor Netlify function usage** - background functions count toward limits
4. **Keep credentials secure** - never commit `.env` to version control
5. **Review test leads regularly** - ensure cleanup is working

### CI/CD Integration Tests

To run integration tests in GitHub Actions:

```yaml
- name: Run EspoCRM Integration Tests
  env:
    ESPOCRM_URL: ${{ secrets.ESPOCRM_URL }}
    ESPOCRM_API_KEY: ${{ secrets.ESPOCRM_API_KEY }}
    LANDING_PAGE_URL: https://landingz.netlify.app
  run: npx playwright test --project=live-integration
```

Add secrets in GitHub: Settings → Secrets and variables → Actions

### Performance Notes

- Each integration test takes ~15-20 seconds (10 seconds for background function processing)
- Tests run sequentially to avoid race conditions
- Use `--workers=1` if running multiple integration test files

### Limitations

- Tests require internet access (call live APIs)
- Tests depend on Netlify and EspoCRM availability
- Background function processing time can vary (5-15 seconds)
- Test data appears in production CRM unless staging instance is used
