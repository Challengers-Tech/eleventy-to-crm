# Landing Pages Overview

This project includes **6 unique landing pages**, each designed for different lead capture strategies and customer journey stages.

## All Landing Pages

### 1. Product Demo (`/product-demo/`)
**Theme:** Product showcase and personalized demonstration
**Target Audience:** Qualified prospects ready to see the product in action
**Primary CTA:** Schedule My Demo

**Key Features:**
- Live walkthrough with sales team
- Interactive Q&A session
- Custom setup demonstration
- Personalized to business needs

**Form Fields:**
- Full Name
- Email Address
- Company Name
- Phone Number (optional)
- Team Size (optional)
- Demo requirements (optional)

**Best For:** Mid-funnel prospects who understand their problem and want to see your solution

---

### 2. Free Trial (`/free-trial/`)
**Theme:** Self-service product trial with no commitment
**Target Audience:** Hands-on buyers who prefer to try before purchasing
**Primary CTA:** Start Free Trial

**Key Features:**
- 14-day full access trial
- No credit card required
- All premium features included
- Dedicated support during trial
- Easy data migration

**Form Fields:**
- First Name
- Last Name
- Work Email
- Company Name
- Phone Number
- Industry (optional)

**Best For:** Bottom-funnel prospects ready to test the product themselves

---

### 3. Enterprise Solutions (`/enterprise/`)
**Theme:** Large-scale deployment for organizations
**Target Audience:** Enterprise decision-makers with complex requirements
**Primary CTA:** Contact Sales

**Key Features:**
- Unlimited scale with 99.9% SLA
- Advanced security and compliance
- Custom integrations and API access
- Dedicated success manager
- 24/7 priority support
- Custom training programs

**Form Fields:**
- Full Name
- Business Email
- Company Name
- Job Title
- Phone Number
- Number of Users
- Current CRM System (optional)
- Requirements (optional)

**Best For:** Large organizations needing custom solutions and white-glove service

---

### 4. Live Webinar (`/webinar/`)
**Theme:** Educational event and expert training
**Target Audience:** Early-stage prospects seeking education and industry insights
**Primary CTA:** Reserve My Spot

**Key Features:**
- Live expert training sessions
- Interactive Q&A with industry leaders
- Exclusive resources and playbooks
- Networking opportunities
- Lifetime recording access
- Certificate of completion

**Form Fields:**
- First Name
- Last Name
- Email Address
- Company (optional)
- Job Role (optional)
- Biggest sales challenge (optional)

**Best For:** Top-funnel awareness stage, building authority and gathering early-stage leads

---

### 5. Free Sales Playbook (`/free-guide/`)
**Theme:** High-value content download and lead magnet
**Target Audience:** Professionals seeking actionable knowledge and frameworks
**Primary CTA:** Download Free Guide

**Key Features:**
- 47-page comprehensive guide
- Battle-tested methods and templates
- Email templates and call scripts
- Real case studies
- Step-by-step frameworks
- Instant download

**Form Fields:**
- Full Name
- Work Email
- Company Name (optional)
- Your Role (optional)
- Company Size (optional)

**Best For:** Content marketing and nurturing top-funnel prospects over time

---

### 6. Free Sales Assessment (`/sales-assessment/`)
**Theme:** Personalized consultation and expert analysis
**Target Audience:** Sales leaders seeking strategic guidance
**Primary CTA:** Request Free Assessment

**Key Features:**
- 30-minute one-on-one consultation
- Custom gap analysis
- Benchmarking against industry standards
- Actionable roadmap with priorities
- Technology stack audit
- No obligation or sales pressure

**Form Fields:**
- Full Name
- Business Email
- Company Name
- Your Role
- Phone Number
- Team Size
- Current Annual Revenue (optional)
- Biggest sales challenge (required)

**Best For:** High-intent prospects, qualifying enterprise opportunities, building relationships with decision-makers

---

## Landing Page Strategy by Funnel Stage

### Top of Funnel (Awareness)
- **Webinar** - Build authority and educate
- **Free Guide** - Capture email addresses with value

### Middle of Funnel (Consideration)
- **Product Demo** - Show solution capabilities
- **Free Assessment** - Personalize the conversation

### Bottom of Funnel (Decision)
- **Free Trial** - Remove friction for purchase
- **Enterprise** - Handle complex deals

---

## Conversion Optimization Features

All landing pages include:

✅ **Mobile-responsive design** - Looks great on all devices
✅ **Fast loading times** - Static site generation for speed
✅ **Clear value proposition** - Benefit-focused headlines
✅ **Social proof elements** - Built into content
✅ **Spam protection** - Honeypot fields
✅ **Form validation** - Required fields marked
✅ **Success tracking** - Redirects to success page
✅ **CRM integration** - Auto-send to EspoCRM
✅ **SEO optimized** - Meta descriptions and proper markup

---

## Customization Guide

### Via Admin Panel
1. Go to `/admin/`
2. Log in with Netlify Identity
3. Click "Landing Pages"
4. Select any page to edit:
   - Headline and subheadline
   - Features list
   - Form fields
   - Call-to-action text
   - Body content
5. Click "Publish" to deploy changes

### Via Code
Edit the markdown files in `src/pages/`:
- `product-demo.md`
- `free-trial.md`
- `enterprise.md`
- `webinar.md`
- `free-guide.md`
- `sales-assessment.md`

---

## Lead Routing Strategy

Different landing pages can be routed to different teams or workflows in EspoCRM:

| Landing Page | Lead Source Tag | Suggested Assignment |
|--------------|----------------|---------------------|
| Product Demo | `Landing Page: Request a Product Demo` | Sales Development Rep |
| Free Trial | `Landing Page: Start Your Free Trial` | Trial Onboarding Team |
| Enterprise | `Landing Page: Enterprise Solutions` | Enterprise Account Executive |
| Webinar | `Landing Page: Join Our Exclusive Webinar` | Marketing/Nurture Campaign |
| Free Guide | `Landing Page: Download Free Sales Playbook` | Marketing/Nurture Campaign |
| Free Assessment | `Landing Page: Free Sales Process Assessment` | Senior Sales Consultant |

You can customize lead routing in the Netlify Function at `netlify/functions/form-submission.js`

---

## A/B Testing Recommendations

Consider creating variations to test:

1. **Headline variations** - Different value propositions
2. **CTA button text** - "Get Started" vs "Sign Up Now" vs "Try Free"
3. **Form length** - More fields (qualification) vs fewer fields (conversion)
4. **Social proof placement** - Above fold vs below form
5. **Feature focus** - Different pain points highlighted
6. **Visual hierarchy** - Image placement and sizing

---

## Analytics Setup

Track these metrics for each page:

- **Page views** - Total traffic
- **Form submissions** - Conversion events
- **Conversion rate** - Submissions / Views
- **Time on page** - Engagement indicator
- **Bounce rate** - Content relevance
- **Form field abandonment** - Where people drop off

Recommended tools:
- Google Analytics 4
- Hotjar for heatmaps
- Microsoft Clarity (free)
- Netlify Analytics

---

## Next Steps

1. **Customize content** for your specific business
2. **Add your branding** - Logo, colors, fonts
3. **Set up tracking** - Analytics and conversion pixels
4. **Drive traffic** - Paid ads, SEO, social media
5. **Monitor performance** - Review metrics weekly
6. **Optimize continuously** - Test and improve
7. **Scale what works** - Double down on high-performers

---

## Support

For questions or issues:
- Check the main [README.md](README.md)
- Review [DEPLOYMENT.md](DEPLOYMENT.md)
- Test locally with `npm start`
- View Netlify Function logs for integration issues
