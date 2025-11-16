/**
 * Debug Script: Test Form Submission → Netlify Function → EspoCRM API
 *
 * This script simulates the entire flow to help identify where the issue is:
 * 1. Simulates form submission data
 * 2. Processes it like the Netlify function
 * 3. POSTs to EspoCRM API
 * 4. Shows detailed logging at each step
 */

require('dotenv').config({ path: '.env.local' });
const fetch = require('node-fetch');

// Configuration
const ESPOCRM_URL = process.env.ESPOCRM_URL || 'https://crm.challengers.tech';
const ESPOCRM_API_ENDPOINT = `${ESPOCRM_URL}/api/v1`;

async function debugSubmission() {
  console.log('\n🔍 === DEBUGGING FORM SUBMISSION TO ESPOCRM ===\n');

  // Step 1: Check environment variables
  console.log('📋 Step 1: Environment Variables Check');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  const apiKey = process.env.ESPOCRM_API_KEY;
  const username = process.env.ESPOCRM_USERNAME;
  const password = process.env.ESPOCRM_PASSWORD;

  console.log('ESPOCRM_URL:', ESPOCRM_URL);
  console.log('ESPOCRM_API_KEY:', apiKey ? `${apiKey.substring(0, 8)}...` : '❌ NOT SET');
  console.log('ESPOCRM_USERNAME:', username ? '✓ SET' : '❌ NOT SET');
  console.log('ESPOCRM_PASSWORD:', password ? '✓ SET' : '❌ NOT SET');

  if (!apiKey && (!username || !password)) {
    console.error('\n❌ ERROR: No credentials configured!');
    console.error('Please set ESPOCRM_API_KEY or ESPOCRM_USERNAME/ESPOCRM_PASSWORD in .env.local\n');
    process.exit(1);
  }

  // Step 2: Simulate form submission
  console.log('\n📝 Step 2: Simulating Form Submission');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const testFormData = {
  first_name: 'Debug',
  last_name: 'Test',
  email: `debug-test-${Date.now()}@example.com`,
  phone: '+1 555-0999',
  company: 'Debug Corp',
  job_title: 'QA Engineer',
    team_size: '10-50',
    message: 'This is a test submission for debugging'
  };

  console.log('Form Data:', JSON.stringify(testFormData, null, 2));

  // Step 3: Process like Netlify function
  console.log('\n⚙️  Step 3: Processing Data (Like Netlify Function)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // Build description with extra form data
  let fullDescription = testFormData.message || '';

  const additionalInfo = [];
  if (testFormData.team_size) additionalInfo.push(`Team Size: ${testFormData.team_size}`);
  if (testFormData.industry) additionalInfo.push(`Industry: ${testFormData.industry}`);
  if (testFormData.current_crm) additionalInfo.push(`Current CRM: ${testFormData.current_crm}`);

  if (additionalInfo.length > 0) {
    fullDescription += (fullDescription ? '\n\n' : '') + additionalInfo.join('\n');
  }

  // Prepare lead data - ONLY STANDARD FIELDS
  const leadData = {
    firstName: testFormData.first_name || testFormData.name?.split(' ')[0] || '',
    lastName: testFormData.last_name || testFormData.name?.split(' ').slice(1).join(' ') || 'Unknown',
    emailAddress: testFormData.email || '',
    phoneNumber: testFormData.phone || '',
    accountName: testFormData.company || '',
    title: testFormData.job_title || testFormData.role || '',
    description: fullDescription,
    source: 'Web Site',
    status: 'New',
    website: testFormData.website || ''
  };

  console.log('Lead Data to Send:', JSON.stringify(leadData, null, 2));

  // Validate required fields
  if (!leadData.emailAddress) {
    console.error('\n❌ ERROR: Missing required field: emailAddress\n');
    process.exit(1);
  }

  // Step 4: Prepare authentication
  console.log('\n🔐 Step 4: Authentication Setup');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  let authHeader;
  if (apiKey) {
    authHeader = `ApiKey ${apiKey}`;
    console.log('Auth Method: API Key');
    console.log('Auth Header:', `ApiKey ${apiKey.substring(0, 8)}...`);
  } else {
    const credentials = Buffer.from(`${username}:${password}`).toString('base64');
    authHeader = `Basic ${credentials}`;
    console.log('Auth Method: Basic Auth');
    console.log('Username:', username);
  }

  // Step 5: Test API connectivity
  console.log('\n🔌 Step 5: Testing API Connectivity');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Endpoint:', `${ESPOCRM_API_ENDPOINT}/Lead`);

  try {
  // First, test with a simple GET to verify credentials
  console.log('\nTesting credentials with GET /Lead...');
  const testResponse = await fetch(`${ESPOCRM_API_ENDPOINT}/Lead?maxSize=1`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': apiKey || '',
      'Authorization': authHeader
    }
  });

  console.log('Test Response Status:', testResponse.status, testResponse.statusText);

  if (!testResponse.ok) {
    const errorText = await testResponse.text();
    console.error('\n❌ CREDENTIALS TEST FAILED');
    console.error('Status:', testResponse.status);
    console.error('Response:', errorText);
    console.error('\nPossible issues:');
    console.error('1. API Key is invalid or expired');
    console.error('2. API User doesn\'t have permissions');
    console.error('3. EspoCRM URL is incorrect\n');
    process.exit(1);
  }

  console.log('✅ Credentials Valid - Can access EspoCRM API');

  // Step 6: Create the lead
  console.log('\n🚀 Step 6: Creating Lead in EspoCRM');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('POST', `${ESPOCRM_API_ENDPOINT}/Lead`);
  console.log('Headers:', {
    'Content-Type': 'application/json',
    'X-Api-Key': apiKey ? `${apiKey.substring(0, 8)}...` : '',
    'Authorization': authHeader.substring(0, 20) + '...'
  });
  console.log('Body:', JSON.stringify(leadData, null, 2));

  const createLeadResponse = await fetch(`${ESPOCRM_API_ENDPOINT}/Lead`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': apiKey || '',
      'Authorization': authHeader
    },
    body: JSON.stringify(leadData)
  });

  console.log('\n📡 Response Status:', createLeadResponse.status, createLeadResponse.statusText);

  if (!createLeadResponse.ok) {
    const errorText = await createLeadResponse.text();
    console.error('\n❌ LEAD CREATION FAILED');
    console.error('Status:', createLeadResponse.status);
    console.error('Response:', errorText);

    // Try to parse as JSON for better error messages
    try {
      const errorJson = JSON.parse(errorText);
      console.error('\nError Details:', JSON.stringify(errorJson, null, 2));
    } catch (e) {
      // Not JSON, already displayed as text
    }

    console.error('\nPossible issues:');
    console.error('1. Invalid field names or values');
    console.error('2. Missing required fields');
    console.error('3. API User lacks permissions to create leads');
    console.error('4. Field validation failed\n');
    process.exit(1);
  }

  const leadResult = await createLeadResponse.json();
  console.log('\n✅ SUCCESS! Lead Created in EspoCRM');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Lead ID:', leadResult.id);
  console.log('Lead Data:', JSON.stringify(leadResult, null, 2));

  // Step 7: Verify lead exists
  console.log('\n🔍 Step 7: Verifying Lead in EspoCRM');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const verifyResponse = await fetch(`${ESPOCRM_API_ENDPOINT}/Lead/${leadResult.id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': apiKey || '',
      'Authorization': authHeader
    }
  });

  if (verifyResponse.ok) {
    const verifiedLead = await verifyResponse.json();
    console.log('✅ Lead Verified in CRM');
    console.log('Name:', `${verifiedLead.firstName} ${verifiedLead.lastName}`);
    console.log('Email:', verifiedLead.emailAddress);
    console.log('Company:', verifiedLead.accountName);
    console.log('Status:', verifiedLead.status);
  }

  // Step 8: Cleanup - delete test lead
  console.log('\n🧹 Step 8: Cleanup - Deleting Test Lead');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const deleteResponse = await fetch(`${ESPOCRM_API_ENDPOINT}/Lead/${leadResult.id}`, {
    method: 'DELETE',
    headers: {
      'X-Api-Key': apiKey || '',
      'Authorization': authHeader
    }
  });

  if (deleteResponse.ok) {
    console.log('✅ Test lead deleted successfully');
  } else {
    console.log('⚠️  Could not delete test lead - please delete manually:', leadResult.id);
  }

  console.log('\n✨ === DEBUG COMPLETE - ALL TESTS PASSED ===\n');
  console.log('The form submission flow is working correctly!');
  console.log('If production submissions are failing, the issue is likely:');
  console.log('1. Environment variables not configured in Netlify');
  console.log('2. Different credentials between local and Netlify\n');

} catch (error) {
  console.error('\n❌ UNEXPECTED ERROR');
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
  console.error('\nThis could indicate:');
  console.error('1. Network connectivity issues');
  console.error('2. EspoCRM server is down');
  console.error('3. Invalid URL or endpoint\n');
  process.exit(1);
  }
}

// Run the debug function
debugSubmission().catch(error => {
  console.error('\n💥 FATAL ERROR:', error);
  process.exit(1);
});
