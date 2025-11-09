/**
 * Netlify Background Function - Automatically triggered on form submissions
 * This function runs in the background when any form is submitted
 */

const fetch = require('node-fetch');

// EspoCRM API configuration from environment variables
const ESPOCRM_URL = process.env.ESPOCRM_URL || 'https://crm.challengers.tech';
const ESPOCRM_API_ENDPOINT = `${ESPOCRM_URL}/api/v1`;

exports.handler = async (event, context) => {
  console.log('Form submission event received');

  try {
    // Parse the Netlify form submission event
    const submission = JSON.parse(event.body);

    // Extract form data from the submission
    const formData = submission.data;
    const formName = submission.form_name || 'unknown';

    console.log('Processing form:', formName);
    console.log('Form data:', formData);

    // Prepare lead data for EspoCRM
    const leadData = {
      firstName: formData.first_name || formData.name?.split(' ')[0] || '',
      lastName: formData.last_name || formData.name?.split(' ').slice(1).join(' ') || 'Unknown',
      emailAddress: formData.email || '',
      phoneNumber: formData.phone || '',
      accountName: formData.company || '',
      title: formData.job_title || formData.role || '',
      description: formData.message || formData.requirements || formData.challenge || '',
      source: 'Website',
      sourceDescription: `Landing Page: ${formData.page || formName}`,
      status: 'New',
      // Additional fields based on form type
      ...(formData.team_size && { teamSize: formData.team_size }),
      ...(formData.user_count && { userCount: formData.user_count }),
      ...(formData.industry && { industry: formData.industry }),
      ...(formData.current_crm && { currentCrm: formData.current_crm }),
      ...(formData.company_size && { companySize: formData.company_size }),
      ...(formData.revenue_range && { revenueRange: formData.revenue_range }),
      ...(formData.job_role && { jobRole: formData.job_role }),
    };

    // Get EspoCRM credentials from environment variables
    const apiKey = process.env.ESPOCRM_API_KEY;
    const username = process.env.ESPOCRM_USERNAME;
    const password = process.env.ESPOCRM_PASSWORD;

    // Check if credentials are configured
    if (!apiKey && (!username || !password)) {
      console.error('EspoCRM credentials not configured in environment variables');
      console.error('Please set ESPOCRM_API_KEY or ESPOCRM_USERNAME/ESPOCRM_PASSWORD');

      // Log the data for manual processing
      console.log('Form data (not sent to CRM):', JSON.stringify(leadData, null, 2));

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Form received but CRM credentials not configured',
          warning: 'Please configure environment variables'
        })
      };
    }

    // Prepare authentication header
    let authHeader;
    if (apiKey) {
      authHeader = `ApiKey ${apiKey}`;
      console.log('Using API Key authentication');
    } else {
      const credentials = Buffer.from(`${username}:${password}`).toString('base64');
      authHeader = `Basic ${credentials}`;
      console.log('Using Basic authentication');
    }

    // Create lead in EspoCRM
    console.log('Sending lead to EspoCRM:', ESPOCRM_API_ENDPOINT);
    const createLeadResponse = await fetch(`${ESPOCRM_API_ENDPOINT}/Lead`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey || '',
        'Authorization': authHeader
      },
      body: JSON.stringify(leadData)
    });

    if (!createLeadResponse.ok) {
      const errorText = await createLeadResponse.text();
      console.error('EspoCRM API error:', createLeadResponse.status, errorText);
      throw new Error(`Failed to create lead: ${createLeadResponse.statusText} - ${errorText}`);
    }

    const leadResult = await createLeadResponse.json();
    console.log('✅ Lead created successfully in EspoCRM:', leadResult.id);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Lead created successfully',
        leadId: leadResult.id
      })
    };

  } catch (error) {
    console.error('❌ Error processing form submission:', error.message);
    console.error('Stack trace:', error.stack);

    // Return success to avoid blocking the form submission
    // The error will be logged in Netlify Functions logs for debugging
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Form received',
        note: 'Processing in background'
      })
    };
  }
};
