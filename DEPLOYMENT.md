# Deployment Guide

## Step-by-Step Deployment to Netlify

### Prerequisites
- A GitHub/GitLab/Bitbucket account
- A Netlify account (free tier is sufficient)
- EspoCRM credentials from crm.challengers.tech

### Step 1: Initialize Git Repository

```bash
git init
git add .
git commit -m "Initial commit: Landing pages with CMS and EspoCRM integration"
```

### Step 2: Push to Remote Repository

Create a new repository on GitHub/GitLab/Bitbucket, then:

```bash
git remote add origin YOUR_REPOSITORY_URL
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Netlify

1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose your Git provider and select your repository
4. Build settings (auto-detected from netlify.toml):
   - Build command: `npm run build`
   - Publish directory: `_site`
5. Click "Deploy site"

### Step 4: Configure Netlify Identity

1. In your Netlify site dashboard, go to **Site settings** → **Identity**
2. Click **Enable Identity**
3. Under **Registration preferences**, select **Invite only**
4. Scroll to **Services** → Click **Enable Git Gateway**

### Step 5: Set Environment Variables

1. Go to **Site settings** → **Environment variables**
2. Add the following variables (choose Option 1 OR Option 2):

**Option 1: API Key Authentication (Recommended)**

| Variable | Value | Description |
|----------|-------|-------------|
| `ESPOCRM_API_KEY` | `your_api_key` | Your EspoCRM API key |

**Option 2: Basic Authentication (Alternative)**

| Variable | Value | Description |
|----------|-------|-------------|
| `ESPOCRM_USERNAME` | `your_username` | EspoCRM username |
| `ESPOCRM_PASSWORD` | `your_password` | EspoCRM password |

3. Click **Save**
4. Trigger a new deploy for the variables to take effect

### Step 6: Invite Admin User

1. Go to **Identity** tab in Netlify dashboard
2. Click **Invite users**
3. Enter your email address
4. Check your email for the invitation
5. Click the link and set your password

### Step 7: Access Your Site

Your site will be available at: `https://[site-name].netlify.app`

- **Home page**: `https://[site-name].netlify.app/`
- **Admin panel**: `https://[site-name].netlify.app/admin/`
- **Landing pages**:
  - `https://[site-name].netlify.app/product-demo/`
  - `https://[site-name].netlify.app/free-trial/`
  - `https://[site-name].netlify.app/enterprise/`

### Step 8: Custom Domain (Optional)

1. Go to **Site settings** → **Domain management**
2. Click **Add custom domain**
3. Enter your domain name
4. Follow the DNS configuration instructions
5. Update the `DEPLOY_PRIME_URL` in netlify.toml if needed

## Testing the Integration

### Test Form Submission

1. Visit one of your landing pages
2. Fill out and submit the form
3. You should be redirected to the success page

### Verify in EspoCRM

1. Log in to crm.challengers.tech
2. Navigate to the Leads module
3. Check for the newly created lead with form data

### Check Netlify Function Logs

1. Go to **Functions** tab in Netlify dashboard
2. Click on `form-submission`
3. View the logs to see execution details and any errors

## Troubleshooting

### Form Submissions Not Creating Leads

Check the following:
1. Environment variables are set correctly in Netlify
2. EspoCRM API credentials are valid
3. View function logs for specific error messages
4. Ensure EspoCRM API is accessible (not blocked by firewall)

### CMS Not Loading

1. Verify Netlify Identity is enabled
2. Check that Git Gateway is enabled
3. Clear browser cache
4. Try logging out and back in

### Build Failures

1. Check the deploy log in Netlify
2. Ensure all dependencies are in package.json
3. Verify Node version is 18 or higher

## EspoCRM API Setup

If you need to set up the EspoCRM API:

### Option 1: API Key (Recommended)

1. **Create API User**
   - Log in to EspoCRM as admin
   - Go to Administration → API Users
   - Create a new API user or edit an existing user
   - Assign appropriate roles (needs access to create Leads)

2. **Generate API Key**
   - In the API User settings, click "Generate New API Key"
   - Copy the generated API key
   - Save it securely (you won't be able to see it again)

3. **Test API Access**
   - Use a tool like Postman to test authentication
   - Endpoint: `GET https://crm.challengers.tech/api/v1/Lead`
   - Headers:
     ```
     X-Api-Key: your_api_key
     ```
   - You should receive a list of leads

### Option 2: Basic Authentication (Alternative)

1. **Create User Account**
   - Create a regular user in EspoCRM with appropriate permissions
   - Ensure the user has access to create and read Leads

2. **Test API Access**
   - Endpoint: `GET https://crm.challengers.tech/api/v1/Lead`
   - Headers:
     ```
     Authorization: Basic base64(username:password)
     ```

## Updating Your Site

### Making Changes

1. **Via Admin Panel** (for content):
   - Log in to `/admin/`
   - Make your changes
   - Click "Publish"
   - Changes will trigger automatic deployment

2. **Via Code** (for design/functionality):
   - Make changes locally
   - Test with `npm start`
   - Commit and push to your repository
   - Netlify will automatically deploy

## Support Resources

- [Netlify Documentation](https://docs.netlify.com)
- [Decap CMS Documentation](https://decapcms.org/docs/)
- [Eleventy Documentation](https://www.11ty.dev/docs/)
- [EspoCRM API Documentation](https://docs.espocrm.com/development/api/)

## Next Steps

After deployment, consider:

1. **Custom Domain**: Add your own domain name
2. **Analytics**: Integrate Google Analytics or Plausible
3. **Email Notifications**: Set up email notifications for form submissions
4. **A/B Testing**: Create variations of landing pages
5. **Additional Pages**: Create more targeted landing pages
6. **Custom Branding**: Update colors, fonts, and imagery
