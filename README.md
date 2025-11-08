# Sales Engine - Landing Pages with Netlify & SuiteCRM Integration

A modern, static landing page system built with Eleventy and Decap CMS, featuring automatic lead capture and SuiteCRM integration.

## Features

- **3 Pre-built Landing Pages**: Product Demo, Free Trial, and Enterprise
- **User-Friendly CMS**: Manage content without touching code
- **Easy Page Creation**: Create new landing pages through the admin interface
- **Netlify Forms**: Automatic form handling with spam protection
- **SuiteCRM Integration**: Leads automatically sent to your CRM at crm.challengers.tech
- **Fully Responsive**: Mobile-friendly design
- **Fast Performance**: Static site generation for optimal speed
- **SEO Friendly**: Clean markup and meta tags

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Local Development

```bash
npm start
```

This will start the development server at `http://localhost:8080`

### 3. Build for Production

```bash
npm run build
```

The built site will be in the `_site` directory.

## Deployment to Netlify

### Initial Setup

1. **Push to Git Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

2. **Connect to Netlify**
   - Go to [Netlify](https://app.netlify.com)
   - Click "New site from Git"
   - Choose your repository
   - Build settings are automatically detected from `netlify.toml`
   - Click "Deploy site"

3. **Enable Netlify Identity** (for CMS admin access)
   - Go to Site settings > Identity
   - Click "Enable Identity"
   - Under Registration preferences, select "Invite only"
   - Under External providers (optional), enable GitHub/Google if desired

4. **Enable Git Gateway**
   - Go to Site settings > Identity > Services
   - Click "Enable Git Gateway"

5. **Configure Environment Variables** (for SuiteCRM integration)
   - Go to Site settings > Build & deploy > Environment variables
   - Add the following variables:
     - `SUITECRM_URL`: https://crm.challengers.tech
     - `SUITECRM_USERNAME`: Your SuiteCRM username
     - `SUITECRM_PASSWORD`: Your SuiteCRM password
     - `SUITECRM_CLIENT_ID`: Your OAuth2 client ID
     - `SUITECRM_CLIENT_SECRET`: Your OAuth2 client secret

6. **Invite Yourself as Admin**
   - Go to Identity tab
   - Click "Invite users"
   - Enter your email
   - Check your email and accept the invite
   - Set your password

### Accessing the Admin Panel

1. Visit `https://your-site.netlify.app/admin/`
2. Log in with your Netlify Identity credentials
3. You can now:
   - Edit existing landing pages
   - Create new landing pages
   - Customize all content without coding

## Project Structure

```
sales-engine/
├── src/
│   ├── _includes/
│   │   └── layouts/
│   │       └── landing.njk       # Landing page template
│   ├── admin/
│   │   ├── index.html           # CMS admin interface
│   │   └── config.yml           # CMS configuration
│   ├── css/
│   │   └── style.css            # Styles
│   ├── pages/
│   │   ├── product-demo.md      # Product demo landing page
│   │   ├── free-trial.md        # Free trial landing page
│   │   └── enterprise.md        # Enterprise landing page
│   ├── index.njk                # Home page
│   └── success.html             # Form success page
├── netlify/
│   └── functions/
│       └── form-submission.js   # SuiteCRM integration function
├── .eleventy.js                 # Eleventy configuration
├── netlify.toml                 # Netlify configuration
├── package.json
└── README.md
```

## Landing Pages

### 1. Product Demo (`/product-demo/`)
Designed for prospects who want to see the product in action.
- Form fields: Name, Email, Company, Phone, Team Size, Message
- Focus: Scheduling personalized demos

### 2. Free Trial (`/free-trial/`)
Optimized for sign-ups with minimal friction.
- Form fields: First Name, Last Name, Email, Company, Phone, Industry
- Focus: Quick onboarding, no credit card required

### 3. Enterprise (`/enterprise/`)
Tailored for large organizations with complex needs.
- Form fields: Name, Email, Company, Job Title, Phone, User Count, Current CRM, Requirements
- Focus: Custom solutions and dedicated support

## Creating New Landing Pages

### Via Admin Panel (Recommended)

1. Go to `https://your-site.netlify.app/admin/`
2. Log in
3. Click "Landing Pages" > "New Landing Page"
4. Fill in the content:
   - Title and description
   - Headline and subheadline
   - Features list
   - Form fields
   - Call to action
   - Permalink (e.g., `/new-page/`)
5. Click "Publish"
6. The page will be live after the next deployment

### Manually

Create a new `.md` file in `src/pages/` with this structure:

```markdown
---
title: "Page Title"
description: "Page description for SEO"
headline: "Main Headline"
subheadline: "Supporting text"
layout: "layouts/landing.njk"
permalink: "/page-url/"
features:
  - title: "Feature 1"
    description: "Feature description"
    icon: "🎯"
formFields:
  - label: "Name"
    name: "name"
    type: "text"
    required: true
cta:
  buttonText: "Submit"
  successMessage: "Thank you!"
---

Additional content goes here (optional).
```

## SuiteCRM Integration

### How It Works

1. User submits a form on any landing page
2. Netlify Forms captures the submission
3. A Netlify Function (`form-submission.js`) is triggered
4. The function authenticates with SuiteCRM API
5. A new Lead is created in SuiteCRM with all form data
6. User sees success message

### Lead Mapping

Form data is mapped to SuiteCRM Lead fields:

- `name` or `first_name` → `first_name`
- `last_name` or extracted from `name` → `last_name`
- `email` → `email1`
- `phone` → `phone_mobile`
- `company` → `account_name`
- `job_title` → `title`
- `message` or `requirements` → `description`
- Form page name → `lead_source_description`

### Setting Up SuiteCRM API

1. **Create API User in SuiteCRM**
   - Log in to SuiteCRM admin panel
   - Create a new user for API access
   - Note the username and password

2. **Configure OAuth2**
   - Go to Admin > OAuth2 Clients and Tokens
   - Create a new client
   - Note the Client ID and Secret
   - Set appropriate scopes

3. **Add Credentials to Netlify**
   - Add the credentials as environment variables (see Deployment section above)

4. **Test Integration**
   - Submit a form on your deployed site
   - Check Netlify Functions logs for any errors
   - Verify the lead appears in SuiteCRM

## Customization

### Styling

Edit `src/css/style.css` to customize colors, fonts, and layout.

CSS variables for easy color changes:
```css
:root {
  --primary-color: #2563eb;
  --secondary-color: #1e40af;
  --text-color: #1f2937;
  /* ... more variables */
}
```

### Form Fields

Add or modify form fields in the admin panel or in the page frontmatter:

```yaml
formFields:
  - label: "Your Label"
    name: "field_name"
    type: "text"  # text, email, tel, textarea
    required: true
    placeholder: "Optional placeholder"
```

### Layout Template

Modify `src/_includes/layouts/landing.njk` to change the overall page structure.

## Netlify Forms Configuration

Forms are automatically detected by Netlify. Each form includes:

- **Spam Protection**: Honeypot field
- **Form Identification**: Hidden `form-name` field
- **Data Attribute**: `data-netlify="true"`

To view form submissions in Netlify:
1. Go to your site dashboard
2. Click "Forms" in the navigation
3. View all submissions and export data

## Troubleshooting

### CMS Not Loading

- Ensure Netlify Identity is enabled
- Check that you've invited and confirmed your user
- Clear browser cache and try again

### Forms Not Submitting

- Verify Netlify Forms is enabled in your plan
- Check that `data-netlify="true"` is present in the form
- Look for errors in browser console

### SuiteCRM Integration Not Working

- Check environment variables are set correctly
- View Netlify Function logs for error details
- Verify SuiteCRM API credentials and permissions
- Ensure SuiteCRM API is accessible from Netlify servers

### Build Failures

- Check Netlify build logs for specific errors
- Ensure all dependencies are in `package.json`
- Verify Node version compatibility (should be 18+)

## Support

For issues or questions:
1. Check the Netlify documentation
2. Review Eleventy documentation
3. Check Decap CMS documentation
4. Review SuiteCRM API documentation

## License

ISC
