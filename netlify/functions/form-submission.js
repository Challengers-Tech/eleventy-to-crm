/**
 * Netlify Function to handle form submissions and send to EspoCRM
 * This function is triggered on form submission via Netlify Forms
 */

const fetch = require('node-fetch');

// EspoCRM API configuration
const ESPOCRM_URL = 'https://crm.challengers.tech';
const ESPOCRM_API_ENDPOINT = `${ESPOCRM_URL}/api/v1`;

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    // Parse the form data
    const data = JSON.parse(event.body);
    const { payload } = data;

    if (!payload) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No payload found' })
      };
    }

    // Extract form data
    const formData = payload.data;
    const formName = payload.form_name;

    console.log('Form submission received:', formName);
    console.log('Form data:', formData);

    // Prepare lead data for EspoCRM
    const leadData = {
      firstName: formData.first_name || formData.name?.split(' ')[0] || '',
      lastName: formData.last_name || formData.name?.split(' ').slice(1).join(' ') || formData.name || 'Unknown',
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
      console.error('EspoCRM credentials not configured');
      // Still return success to user, but log the error
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Form submitted successfully',
          warning: 'CRM integration pending configuration'
        })
      };
    }

    let authHeader;

    // Prefer API Key authentication (simpler and more secure)
    if (apiKey) {
      authHeader = `ApiKey ${apiKey}`;
    } else {
      // Fall back to Basic Auth if API key not available
      const credentials = Buffer.from(`${username}:${password}`).toString('base64');
      authHeader = `Basic ${credentials}`;
    }

    // Create lead in EspoCRM
    const createLeadResponse = await fetch(`${ESPOCRM_API_ENDPOINT}/Lead`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey || '', // EspoCRM also supports this header format
        'Authorization': authHeader
      },
      body: JSON.stringify(leadData)
    });

    if (!createLeadResponse.ok) {
      const errorText = await createLeadResponse.text();
      throw new Error(`Failed to create lead: ${createLeadResponse.statusText} - ${errorText}`);
    }

    const leadResult = await createLeadResponse.json();
    console.log('Lead created successfully in EspoCRM:', leadResult.id);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Form submitted and lead created successfully',
        leadId: leadResult.id
      })
    };

  } catch (error) {
    console.error('Error processing form submission:', error);

    // Return success to user even if CRM integration fails
    // This ensures a good user experience while logging the error
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Form submitted successfully',
        note: 'Your information has been received and will be processed shortly.'
      })
    };
  }
};
