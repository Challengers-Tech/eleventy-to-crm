# Debugging Netlify Function - Environment Variables

## Issue Confirmed
✅ Local API integration works perfectly
❌ Production Netlify functions are missing environment variables

## Option 1: Check Function Logs via Dashboard

1. Go to: https://app.netlify.com/sites/landingz/functions
2. Click on `submission-created` function
3. Click on **Function log** tab
4. You should see logs like:
   - `🔵 === FUNCTION STARTED ===`
   - `⚠️ EspoCRM credentials not configured` ← This confirms the issue

## Option 2: Check Function Logs via Netlify CLI

```bash
# Install Netlify CLI if you haven't
npm install -g netlify-cli

# Login to Netlify
netlify login

# Link to your site
netlify link

# Watch function logs in real-time
netlify functions:logs --function=submission-created
```

Then submit a test form and watch the logs appear.

## Fix: Configure Environment Variables

### Method 1: Via Netlify Dashboard (Recommended)

1. Go to: https://app.netlify.com/sites/landingz/configuration/env
2. Click **Add a variable**
3. Add these variables:
   - **Key:** `ESPOCRM_URL`
     **Value:** `https://crm.challengers.tech`

   - **Key:** `ESPOCRM_API_KEY`
     **Value:** `ca067b7f047ec16a72cc6e5ab3a93ca2` (your working key from .env.local)

4. Click **Save**
5. Deploy may be triggered automatically. If not, trigger a new deploy.

### Method 2: Via Netlify CLI

```bash
# Set environment variables
netlify env:set ESPOCRM_URL "https://crm.challengers.tech"
netlify env:set ESPOCRM_API_KEY "ca067b7f047ec16a72cc6e5ab3a93ca2"

# Verify they're set
netlify env:list

# Trigger a new deployment
netlify deploy --prod
```

## Test After Configuring

After setting the environment variables, test by:

1. **Submit a real form** on https://landingz.netlify.app/product-demo/
2. **Check function logs** - you should now see:
   - `✅ Form parsed successfully`
   - `🚀 Sending lead to EspoCRM`
   - `✅ SUCCESS! Lead created in EspoCRM`
   - `🆔 Lead ID: [some-id]`

3. **Verify in EspoCRM**: Go to https://crm.challengers.tech and check the Leads section

4. **Run integration tests**:
   ```bash
   npx playwright test --project=live-integration --headed
   ```
   All 4 tests should now pass!

## Current Status

### What's Working:
- ✅ Form submissions (UI works, users see success page)
- ✅ Local API integration
- ✅ EspoCRM API (server is up and responding)
- ✅ API credentials (your API key is valid)
- ✅ Lead data structure (all fields are correct)

### What's NOT Working:
- ❌ Netlify functions don't have environment variables configured
- ❌ Leads not being created from production forms
- ❌ Integration tests failing

### Root Cause:
**Missing `ESPOCRM_API_KEY` environment variable in Netlify**

The function code at [submission-created.js:81-94](netlify/functions/submission-created.js#L81-L94) checks for credentials and returns early if not configured:

```javascript
if (!apiKey && (!username || !password)) {
  console.error('❌ EspoCRM credentials not configured in environment variables');
  // Returns 200 but doesn't create lead
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Form received but CRM credentials not configured'
    })
  };
}
```
