# Changelog

## EspoCRM Migration & Testing - 2024-11-08

### Major Changes

#### CRM Integration Update
- **Migrated from SuiteCRM to EspoCRM**
  - Updated Netlify Function for EspoCRM API v1
  - Changed authentication to support API Key (recommended) or Basic Auth
  - Updated field mappings to match EspoCRM schema
  - Simplified authentication flow

#### API Changes
**Before (SuiteCRM):**
- OAuth2 authentication with client ID/secret
- JSON:API format (application/vnd.api+json)
- Endpoint: `/Api/V8/module`
- Required: client_id, client_secret, username, password

**After (EspoCRM):**
- API Key or Basic Auth
- Standard JSON format
- Endpoint: `/api/v1/Lead`
- Required: API key OR username/password (simpler setup)

#### Environment Variables Update

**Old Variables (deprecated):**
- `SUITECRM_URL`
- `SUITECRM_USERNAME`
- `SUITECRM_PASSWORD`
- `SUITECRM_CLIENT_ID`
- `SUITECRM_CLIENT_SECRET`

**New Variables:**
- `ESPOCRM_API_KEY` (recommended)
- `ESPOCRM_USERNAME` (alternative)
- `ESPOCRM_PASSWORD` (alternative)

### New Features

#### Automated Testing with Playwright
- Added comprehensive E2E test suite with 36 tests
- Test coverage includes:
  - All 6 landing pages (Product Demo, Free Trial, Enterprise, Webinar, Free Guide, Sales Assessment)
  - Form functionality and validation
  - Responsive design (mobile, tablet, desktop)
  - Navigation and links
  - SEO and meta tags
  - Accessibility
  - Content verification

#### Test Commands
```bash
npm test              # Run all tests headless
npm run test:headed   # Run with visible browser
npm run test:ui       # Interactive UI mode
npm run test:report   # View HTML report
```

### Files Modified

#### Integration Files
- `netlify/functions/form-submission.js` - Updated for EspoCRM API
- `.env.example` - Updated environment variable examples

#### Documentation Files
- `README.md` - Updated all SuiteCRM references to EspoCRM
- `DEPLOYMENT.md` - Updated deployment instructions
- `LANDING-PAGES.md` - Updated CRM references

#### New Files
- `playwright.config.js` - Playwright test configuration
- `tests/landing-pages.spec.js` - Comprehensive test suite (36 tests)
- `TESTING.md` - Complete testing documentation
- `CHANGELOG.md` - This file

#### Configuration Files
- `package.json` - Added Playwright dependency and test scripts

### Breaking Changes

⚠️ **Environment Variables Must Be Updated**

If you're upgrading from the SuiteCRM version:

1. Remove old environment variables in Netlify:
   - `SUITECRM_USERNAME`
   - `SUITECRM_PASSWORD`
   - `SUITECRM_CLIENT_ID`
   - `SUITECRM_CLIENT_SECRET`

2. Add new environment variables:
   - Option 1 (Recommended): `ESPOCRM_API_KEY`
   - Option 2: `ESPOCRM_USERNAME` and `ESPOCRM_PASSWORD`

3. Redeploy your site for changes to take effect

### Migration Guide

#### For Existing Deployments

1. **Generate EspoCRM API Key:**
   - Log into EspoCRM admin panel
   - Go to Administration > API Users
   - Create/edit API user
   - Click "Generate New API Key"
   - Copy the API key

2. **Update Netlify Environment Variables:**
   - Go to Netlify dashboard > Site settings > Environment variables
   - Delete old `SUITECRM_*` variables
   - Add `ESPOCRM_API_KEY` with your API key value
   - Click "Save"

3. **Trigger New Deploy:**
   - Go to Deploys tab
   - Click "Trigger deploy" > "Deploy site"

4. **Test Integration:**
   - Submit a test form on your site
   - Verify lead appears in EspoCRM
   - Check Netlify Function logs for any errors

### Technical Improvements

#### Lead Field Mapping

**EspoCRM uses camelCase instead of underscores:**

| Form Field | Old (SuiteCRM) | New (EspoCRM) |
|------------|----------------|---------------|
| First Name | `first_name` | `firstName` |
| Last Name | `last_name` | `lastName` |
| Email | `email1` | `emailAddress` |
| Phone | `phone_mobile` | `phoneNumber` |
| Company | `account_name` | `accountName` |
| Lead Source | `lead_source_description` | `sourceDescription` |

#### Authentication Flow Simplified

**Before (SuiteCRM):**
1. Request access token with OAuth2
2. Use token in subsequent requests
3. Handle token expiration

**After (EspoCRM):**
1. Use API key directly in header
2. No token management needed
3. More reliable and simpler

### Test Results

```
Running 36 tests using 8 workers
  ✓ 36 passed (18.1s)
```

**Test Breakdown:**
- Home Page: 4 tests
- Product Demo: 4 tests
- Free Trial: 3 tests
- Enterprise: 3 tests
- Webinar: 3 tests
- Free Guide: 3 tests
- Sales Assessment: 3 tests
- Form Functionality: 3 tests
- Responsive Design: 2 tests
- Navigation: 2 tests
- SEO: 2 tests
- Accessibility: 2 tests
- Content Verification: 2 tests

### Performance

- Build time: ~0.3s (9 pages)
- Test suite: ~18s (36 tests)
- No performance degradation from migration

### Compatibility

- Node.js: 18+
- Browsers tested: Chrome/Chromium
- EspoCRM: Compatible with latest version
- Netlify: No changes required to hosting

### Known Issues

None at this time. All tests passing.

### Future Enhancements

Potential improvements for future releases:

- [ ] Add visual regression testing
- [ ] Test with Firefox and Safari browsers
- [ ] Add performance testing
- [ ] Test real mobile devices
- [ ] Add load testing for forms
- [ ] Implement A/B testing framework
- [ ] Add analytics integration
- [ ] Create more landing page templates

### Support

For issues or questions:
- Review [README.md](README.md) for general documentation
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for deployment help
- See [TESTING.md](TESTING.md) for testing information
- Consult [EspoCRM API Documentation](https://docs.espocrm.com/development/api/)

### Contributors

- Migration and testing implementation completed on 2024-11-08

---

## Initial Release - 2024-11-08

### Features

- 6 unique landing pages for different funnel stages
- Decap CMS for content management
- Netlify Forms for lead capture
- Responsive design for all devices
- SEO optimized
- Spam protection
- Success page
- Admin panel for content editing

### Landing Pages

1. **Product Demo** - Personalized demonstration requests
2. **Free Trial** - 14-day trial signups
3. **Enterprise** - Large organization inquiries
4. **Webinar** - Educational event registration
5. **Free Guide** - Content download (lead magnet)
6. **Sales Assessment** - Consultation requests

### Technology Stack

- **Static Site Generator:** Eleventy 3.1.2
- **CMS:** Decap CMS
- **Styling:** Custom CSS with CSS variables
- **Forms:** Netlify Forms
- **CRM:** EspoCRM integration
- **Testing:** Playwright
- **Hosting:** Netlify
