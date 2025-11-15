/**
 * Netlify Background Function - Automatically triggered on form submissions
 * This function runs in the background when any form is submitted
 */

const fetch = require('node-fetch');

// EspoCRM API configuration from environment variables
const ESPOCRM_URL = process.env.ESPOCRM_URL || 'https://crm.challengers.tech';
const ESPOCRM_API_ENDPOINT = `${ESPOCRM_URL}/api/v1`;

exports.handler = async (event, context) => {
  console.log('🔵 === FUNCTION STARTED ===');
  console.log('📥 Event method:', event.httpMethod);
  console.log('📦 Event body preview:', event.body?.substring(0, 200));

  try {
    // Parse the Netlify form submission event
    const submission = JSON.parse(event.body);

    // Extract form data from the submission
    const formData = submission.data;
    const formName = submission.form_name || 'unknown';

    console.log('✅ Form parsed successfully');
    console.log('📝 Form name:', formName);
    console.log('📊 Form data keys:', Object.keys(formData));
    console.log('📧 Email:', formData.email);
    console.log('👤 Name fields:', { first: formData.first_name, last: formData.last_name, full: formData.name });

    // Build description with all extra form data
    let fullDescription = formData.message || formData.requirements || formData.challenge || '';

    // Add additional form data to description
    const additionalInfo = [];
    if (formData.team_size) additionalInfo.push(`Team Size: ${formData.team_size}`);
    if (formData.user_count) additionalInfo.push(`User Count: ${formData.user_count}`);
    if (formData.industry) additionalInfo.push(`Industry: ${formData.industry}`);
    if (formData.current_crm) additionalInfo.push(`Current CRM: ${formData.current_crm}`);
    if (formData.company_size) additionalInfo.push(`Company Size: ${formData.company_size}`);
    if (formData.revenue_range) additionalInfo.push(`Revenue Range: ${formData.revenue_range}`);
    if (formData.job_role) additionalInfo.push(`Job Role: ${formData.job_role}`);

    if (additionalInfo.length > 0) {
      fullDescription += (fullDescription ? '\n\n' : '') + additionalInfo.join('\n');
    }

    // Prepare lead data for EspoCRM - ONLY STANDARD FIELDS
    const leadData = {
      firstName: formData.first_name || formData.name?.split(' ')[0] || '',
      lastName: formData.last_name || formData.name?.split(' ').slice(1).join(' ') || 'Unknown',
      emailAddress: formData.email || '',
      phoneNumber: formData.phone || '',
      accountName: formData.company || '',
      title: formData.job_title || formData.role || '',
      description: fullDescription,
      source: 'Web Site',
      status: 'New',
      website: formData.website || ''
    };

    // Validate required fields
    if (!leadData.emailAddress) {
      console.error('❌ Missing required field: emailAddress');
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Email address is required'
        })
      };
    }

    console.log('📤 Lead data to send:', JSON.stringify(leadData, null, 2));

    // Get EspoCRM credentials from environment variables
    const apiKey = process.env.ESPOCRM_API_KEY;
    const username = process.env.ESPOCRM_USERNAME;
    const password = process.env.ESPOCRM_PASSWORD;

    // Check if credentials are configured
    if (!apiKey && (!username || !password)) {
      console.error('❌ EspoCRM credentials not configured in environment variables');
      console.error('Please set ESPOCRM_API_KEY or ESPOCRM_USERNAME/ESPOCRM_PASSWORD');

      // Log the data for manual processing
      console.log('⚠️ Form data (not sent to CRM):', JSON.stringify(leadData, null, 2));

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
    console.log('🚀 Sending lead to EspoCRM:', ESPOCRM_API_ENDPOINT);
    const createLeadResponse = await fetch(`${ESPOCRM_API_ENDPOINT}/Lead`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey || '',
        'Authorization': authHeader
      },
      body: JSON.stringify(leadData)
    });

    console.log('📡 API Response status:', createLeadResponse.status, createLeadResponse.statusText);

    if (!createLeadResponse.ok) {
      const errorText = await createLeadResponse.text();
      console.error('❌ EspoCRM API error:', createLeadResponse.status);
      console.error('❌ Error body:', errorText);
      throw new Error(`Failed to create lead: ${createLeadResponse.statusText} - ${errorText}`);
    }

    const leadResult = await createLeadResponse.json();
    console.log('✅ SUCCESS! Lead created in EspoCRM');
    console.log('🆔 Lead ID:', leadResult.id);
    console.log('📋 Lead data:', leadResult);

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
