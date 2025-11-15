# EspoCRM Integration Setup Guide

This guide walks you through connecting your Netlify landing pages to EspoCRM at https://crm.challengers.tech.

## How It Works

```
User submits form → Netlify Forms captures it → submission-created.js triggers → Lead created in EspoCRM
```

The integration uses a **Netlify Background Function** that automatically runs whenever any form is submitted on your site.

## Setup Checklist

### ✅ Already Completed

- [x] Forms configured with `data-netlify="true"`
- [x] Background function created (`submission-created.js`)
- [x] Netlify configuration updated

### 🔧 Required Steps

#### 1. Configure Environment Variables in Netlify

1. Go to your Netlify site dashboard
2. Navigate to **Site settings → Environment variables**
3. Click **Add a variable**
4. Add these variables:

   **Option 1: API Key (Recommended)**
   - Variable: `ESPOCRM_API_KEY`
   - Value: Your EspoCRM API key (from EspoCRM → Administration → API Users)

   **Option 2: Username/Password**
   - Variable: `ESPOCRM_USERNAME`
   - Value: Your EspoCRM username
   - Variable: `ESPOCRM_PASSWORD`
   - Value: Your EspoCRM password

5. Also add:
   - Variable: `ESPOCRM_URL`
   - Value: `https://crm.challengers.tech`

6. Click **Save**

#### 2. Deploy the Changes

Push your changes to trigger a new deployment:

```bash
git add .
git commit -m "Add EspoCRM background function integration"
git push
```

#### 3. Verify the Integration

After deployment:

1. **Test a form submission**:
   - Visit one of your landing pages (e.g., `/product-demo/`)
   - Fill out and submit the form
   - You should see the success page

2. **Check Netlify Functions logs**:
   - Go to Netlify dashboard → **Functions**
   - Click on `submission-created`
   - View recent invocations
   - Look for success messages like: `✅ Lead created successfully in EspoCRM: [ID]`

3. **Verify in EspoCRM**:
   - Log in to https://crm.challengers.tech
   - Go to **Leads** module
   - Check for the new lead with data from your test form

## Field Mapping

Form submissions are mapped to EspoCRM Lead fields as follows:

| Form Field | EspoCRM Field | Notes |
|------------|---------------|-------|
| `name` or `first_name` | `firstName` | Auto-splits full name if needed |
| `last_name` | `lastName` | Extracted from full name or separate field |
| `email` | `emailAddress` | Required |
| `phone` | `phoneNumber` | Optional |
| `company` | `accountName` | Company/organization name |
| `job_title` or `role` | `title` | Job position |
| `message`, `requirements`, `challenge` | `description` | Combined notes |
| Auto-set | `source` | Always "Website" |
| Page name | `sourceDescription` | e.g., "Landing Page: Product Demo" |
| Auto-set | `status` | Always "New" |

Additional fields (if present in form):
- `team_size` → `teamSize`
- `user_count` → `userCount`
- `industry` → `industry`
- `current_crm` → `currentCrm`
- `company_size` → `companySize`
- `revenue_range` → `revenueRange`
- `job_role` → `jobRole`

## Troubleshooting

### Forms Submit But No Leads in EspoCRM

1. **Check Function Logs**:
   ```
   Netlify Dashboard → Functions → submission-created → Recent invocations
   ```
   Look for error messages

2. **Verify Environment Variables**:
   - Ensure `ESPOCRM_API_KEY` or username/password are set
   - Ensure `ESPOCRM_URL` is exactly: `https://crm.challengers.tech`
   - No trailing slashes in the URL

3. **Test EspoCRM API Access**:
   - Ensure your API key or credentials are valid
   - Check that the API user has permission to create Leads
   - Verify CORS/firewall settings allow Netlify's IP addresses

### Common Error Messages

**"EspoCRM credentials not configured"**
- Environment variables are missing or misspelled
- Solution: Double-check variable names in Netlify settings

**"Failed to create lead: 401 Unauthorized"**
- Invalid API key or credentials
- Solution: Regenerate API key in EspoCRM or verify username/password

**"Failed to create lead: 403 Forbidden"**
- API user lacks permissions
- Solution: Grant "Create" permission for Leads in EspoCRM user settings

**"Failed to create lead: 404 Not Found"**
- Incorrect EspoCRM URL
- Solution: Verify ESPOCRM_URL is correct

### Enable Detailed Logging

The function logs extensive debugging information. To view:

1. Go to Netlify Functions logs
2. Filter by function: `submission-created`
3. Look for:
   - `Processing form: [form-name]`
   - `Form data: [JSON]`
   - `Using API Key authentication` or `Using Basic authentication`
   - `Sending lead to EspoCRM: [URL]`
   - `✅ Lead created successfully` or `❌ Error processing form submission`

## Testing in Development

To test locally before deploying:

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Set up local environment**:
   Create `.env` file (already in `.gitignore`):
   ```
   ESPOCRM_URL=https://crm.challengers.tech
   ESPOCRM_API_KEY=your_test_api_key
   ```

3. **Run development server**:
   ```bash
   netlify dev
   ```

4. **Test forms locally**:
   - Visit http://localhost:8888
   - Submit a form
   - Check terminal output for function logs

## Security Best Practices

✅ **Do:**
- Use API Key authentication (more secure than username/password)
- Set environment variables in Netlify (never commit to code)
- Use "Invite only" registration for Netlify Identity
- Regularly rotate API keys

❌ **Don't:**
- Never commit API keys or credentials to Git
- Don't use admin accounts for API access
- Don't disable honeypot spam protection
- Don't expose EspoCRM credentials in client-side code

## Advanced Configuration

### Custom Field Mapping

To add custom field mappings, edit [submission-created.js](netlify/functions/submission-created.js):

```javascript
const leadData = {
  // ... existing fields ...

  // Add your custom fields
  customField: formData.my_custom_field || '',
};
```

### Email Notifications

To receive email notifications when leads are created:

1. In EspoCRM, go to **Administration → Notifications**
2. Set up Email notification for "Lead Created" events
3. Configure recipients and email template

### Lead Assignment Rules

To automatically assign leads to sales reps:

1. In EspoCRM, go to **Administration → Workflows**
2. Create a new workflow for "Lead" entity
3. Trigger: "After record created"
4. Actions: Set assignee based on criteria (territory, industry, etc.)

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Netlify Functions logs for detailed errors
3. Verify EspoCRM API documentation: https://docs.espocrm.com/development/api/
4. Test API access with tools like Postman

## Next Steps

Once integration is working:

- [ ] Set up lead nurturing workflows in EspoCRM
- [ ] Configure email templates for follow-ups
- [ ] Set up sales team assignments
- [ ] Monitor conversion rates in EspoCRM reports
- [ ] Integrate with email marketing tools (if needed)
