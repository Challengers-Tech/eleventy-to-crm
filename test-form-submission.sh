#!/bin/bash
# Test Form Submission to Netlify Function
# This script tests the submission-created function both locally and in production

echo "🧪 Form Submission Test Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test data - matches the format sent by form-handler.js
TEST_DATA='{
  "form_name": "product-demo",
  "data": {
    "name": "John Doe",
    "email": "test-'$(date +%s)'@example.com",
    "company": "Test Corp",
    "phone": "+1 555-0123",
    "team_size": "10-50",
    "message": "Testing form submission via curl"
  }
}'

echo "📦 Test Data:"
echo "$TEST_DATA" | jq '.'
echo ""

# Choose environment
echo "Select test environment:"
echo "1) Local (http://localhost:8888)"
echo "2) Production (https://landingz.netlify.app)"
read -p "Enter choice (1 or 2): " choice

case $choice in
  1)
    ENDPOINT="http://localhost:8888/.netlify/functions/submission-created"
    echo ""
    echo "🏠 Testing LOCALLY"
    echo "⚠️  Make sure you've started the dev server with: netlify dev"
    echo ""
    ;;
  2)
    ENDPOINT="https://landingz.netlify.app/.netlify/functions/submission-created"
    echo ""
    echo "🌐 Testing PRODUCTION"
    echo ""
    ;;
  *)
    echo "Invalid choice"
    exit 1
    ;;
esac

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Sending POST request to:"
echo "   $ENDPOINT"
echo ""

# Send the request and capture both status code and response body
HTTP_RESPONSE=$(curl -w "\n%{http_code}" -s -X POST \
  -H "Content-Type: application/json" \
  -d "$TEST_DATA" \
  "$ENDPOINT")

# Extract status code (last line)
HTTP_STATUS=$(echo "$HTTP_RESPONSE" | tail -n1)

# Extract body (everything except last line)
RESPONSE_BODY=$(echo "$HTTP_RESPONSE" | sed '$d')

echo "📡 Response Status: $HTTP_STATUS"
echo ""
echo "📄 Response Body:"
echo "$RESPONSE_BODY" | jq '.'
echo ""

# Check if successful
if [ "$HTTP_STATUS" -eq 200 ]; then
  echo "✅ Request completed successfully"

  # Check if lead was actually created
  if echo "$RESPONSE_BODY" | jq -e '.leadId' > /dev/null 2>&1; then
    LEAD_ID=$(echo "$RESPONSE_BODY" | jq -r '.leadId')
    echo "✅ Lead created in EspoCRM!"
    echo "🆔 Lead ID: $LEAD_ID"
    echo ""
    echo "🔍 View in EspoCRM:"
    echo "   https://crm.challengers.tech/#Lead/view/$LEAD_ID"
  elif echo "$RESPONSE_BODY" | jq -e '.warning' > /dev/null 2>&1; then
    echo "⚠️  Warning: $(echo "$RESPONSE_BODY" | jq -r '.warning')"
    echo "📝 Note: $(echo "$RESPONSE_BODY" | jq -r '.note // .message')"
  else
    echo "ℹ️  Response: $(echo "$RESPONSE_BODY" | jq -r '.message')"
  fi
else
  echo "❌ Request failed with status $HTTP_STATUS"
  echo "Error: $RESPONSE_BODY"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
