/**
 * Netlify Function to handle form submissions and send to SuiteCRM
 * This function is triggered on form submission via Netlify Forms
 */

const fetch = require('node-fetch');

// SuiteCRM API configuration
const SUITECRM_URL = 'https://crm.challengers.tech';
const SUITECRM_API_ENDPOINT = `${SUITECRM_URL}/Api/V8/module`;

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

    // Prepare lead data for SuiteCRM
    const leadData = {
      data: {
        type: 'Leads',
        attributes: {
          first_name: formData.first_name || formData.name?.split(' ')[0] || '',
          last_name: formData.last_name || formData.name?.split(' ').slice(1).join(' ') || formData.name || 'Unknown',
          email1: formData.email || '',
          phone_mobile: formData.phone || '',
          account_name: formData.company || '',
          title: formData.job_title || '',
          description: formData.message || formData.requirements || '',
          lead_source: 'Website',
          lead_source_description: `Landing Page: ${formData.page || formName}`,
          status: 'New',
          // Custom fields based on form type
          ...(formData.team_size && { team_size_c: formData.team_size }),
          ...(formData.user_count && { user_count_c: formData.user_count }),
          ...(formData.industry && { industry_c: formData.industry }),
          ...(formData.current_crm && { current_crm_c: formData.current_crm }),
        }
      }
    };

    // Get SuiteCRM credentials from environment variables
    const username = process.env.SUITECRM_USERNAME;
    const password = process.env.SUITECRM_PASSWORD;

    if (!username || !password) {
      console.error('SuiteCRM credentials not configured');
      // Still return success to user, but log the error
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Form submitted successfully',
          warning: 'CRM integration pending configuration'
        })
      };
    }

    // Authenticate with SuiteCRM
    const authResponse = await fetch(`${SUITECRM_URL}/Api/access_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'password',
        client_id: process.env.SUITECRM_CLIENT_ID || 'suite_crm_client',
        client_secret: process.env.SUITECRM_CLIENT_SECRET || 'secret',
        username: username,
        password: password,
      })
    });

    if (!authResponse.ok) {
      throw new Error(`Authentication failed: ${authResponse.statusText}`);
    }

    const authData = await authResponse.json();
    const accessToken = authData.access_token;

    // Create lead in SuiteCRM
    const createLeadResponse = await fetch(`${SUITECRM_API_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(leadData)
    });

    if (!createLeadResponse.ok) {
      const errorText = await createLeadResponse.text();
      throw new Error(`Failed to create lead: ${createLeadResponse.statusText} - ${errorText}`);
    }

    const leadResult = await createLeadResponse.json();
    console.log('Lead created successfully in SuiteCRM:', leadResult.data.id);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Form submitted and lead created successfully',
        leadId: leadResult.data.id
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
