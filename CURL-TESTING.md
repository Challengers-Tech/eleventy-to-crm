# Testing Form Submission with curl

## Quick Start

### Test Locally (requires `netlify dev` running)

```bash
curl -X POST http://localhost:8888/.netlify/functions/submission-created \
  -H "Content-Type: application/json" \
  -d '{
    "form_name": "product-demo",
    "data": {
      "name": "Test User",
      "email": "test@example.com",
      "company": "Test Corp",
      "phone": "+1 555-0123",
      "team_size": "10-50"
    }
  }'
```

### Test Production

```bash
curl -X POST https://landingz.netlify.app/.netlify/functions/submission-created \
  -H "Content-Type: application/json" \
  -d '{
    "form_name": "product-demo",
    "data": {
      "name": "Test User",
      "email": "test@example.com",
      "company": "Test Corp",
      "phone": "+1 555-0123",
      "team_size": "10-50"
    }
  }'
```

## Windows PowerShell Commands

### Local Test

```powershell
$body = @{
    form_name = "product-demo"
    data = @{
        name = "Test User"
        email = "test@example.com"
        company = "Test Corp"
        phone = "+1 555-0123"
        team_size = "10-50"
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8888/.netlify/functions/submission-created" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

### Production Test

```powershell
$body = @{
    form_name = "product-demo"
    data = @{
        name = "Test User"
        email = "test@example.com"
        company = "Test Corp"
        phone = "+1 555-0123"
        team_size = "10-50"
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://landingz.netlify.app/.netlify/functions/submission-created" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

## Different Form Types

### 1. Product Demo Form

```bash
curl -X POST http://localhost:8888/.netlify/functions/submission-created \
  -H "Content-Type: application/json" \
  -d '{
    "form_name": "product-demo",
    "data": {
      "name": "John Doe",
      "email": "john@example.com",
      "company": "Acme Corp",
      "phone": "+1 555-0100",
      "team_size": "10-50",
      "message": "Interested in a product demo"
    }
  }'
```

### 2. Free Trial Form

```bash
curl -X POST http://localhost:8888/.netlify/functions/submission-created \
  -H "Content-Type: application/json" \
  -d '{
    "form_name": "free-trial",
    "data": {
      "first_name": "Jane",
      "last_name": "Smith",
      "email": "jane@example.com",
      "company": "Tech Startup",
      "phone": "+1 555-0200"
    }
  }'
```

### 3. Enterprise Form

```bash
curl -X POST http://localhost:8888/.netlify/functions/submission-created \
  -H "Content-Type: application/json" \
  -d '{
    "form_name": "enterprise",
    "data": {
      "name": "Bob Johnson",
      "email": "bob@example.com",
      "company": "Big Enterprise LLC",
      "job_title": "CTO",
      "phone": "+1 555-0300",
      "user_count": "500+"
    }
  }'
```

### 4. Sales Assessment Form

```bash
curl -X POST http://localhost:8888/.netlify/functions/submission-created \
  -H "Content-Type: application/json" \
  -d '{
    "form_name": "sales-assessment",
    "data": {
      "name": "Alice Williams",
      "email": "alice@example.com",
      "company": "Sales Inc",
      "job_title": "VP of Sales",
      "phone": "+1 555-0400",
      "team_size": "20",
      "challenge": "Need to improve sales process efficiency"
    }
  }'
```

## Expected Responses

### Success (Lead Created)

```json
{
  "message": "Lead created successfully",
  "leadId": "6919ec8c5e862db8e"
}
```

### Success (but credentials not configured)

```json
{
  "message": "Form received but CRM credentials not configured",
  "warning": "Please configure environment variables"
}
```

### Success (background processing)

```json
{
  "message": "Form received",
  "note": "Processing in background"
}
```

### Error (missing email)

```json
{
  "error": "Email address is required"
}
```

## Testing Workflow

### Step 1: Start Local Dev Server

```bash
netlify dev
```

This will start the server at `http://localhost:8888` with functions available at `/.netlify/functions/`

### Step 2: Test with curl

```bash
curl -X POST http://localhost:8888/.netlify/functions/submission-created \
  -H "Content-Type: application/json" \
  -d '{
    "form_name": "test",
    "data": {
      "first_name": "Debug",
      "last_name": "Test",
      "email": "debug-'$(date +%s)'@example.com",
      "company": "Debug Corp",
      "phone": "+1 555-9999"
    }
  }'
```

### Step 3: Check Function Logs

The function logs will appear in the terminal where `netlify dev` is running. Look for:

- 🔵 Function started
- 📥 Event method: POST
- ✅ Form parsed successfully
- 📤 Lead data to send
- 🚀 Sending lead to EspoCRM
- ✅ SUCCESS! Lead created

### Step 4: Verify in EspoCRM

Go to https://crm.challengers.tech and check the Leads section to see the newly created lead.

## Debugging Tips

### View Full Response with Status Code

```bash
curl -i -X POST http://localhost:8888/.netlify/functions/submission-created \
  -H "Content-Type: application/json" \
  -d '{"form_name":"test","data":{"email":"test@example.com"}}'
```

### Use jq to Format Response

```bash
curl -X POST http://localhost:8888/.netlify/functions/submission-created \
  -H "Content-Type: application/json" \
  -d '{"form_name":"test","data":{"email":"test@example.com"}}' | jq '.'
```

### Test with Verbose Output

```bash
curl -v -X POST http://localhost:8888/.netlify/functions/submission-created \
  -H "Content-Type: application/json" \
  -d '{"form_name":"test","data":{"email":"test@example.com"}}'
```

## Common Issues

### Issue: "Cannot POST /.netlify/functions/submission-created"

**Solution:** Make sure `netlify dev` is running

### Issue: "Form received but CRM credentials not configured"

**Solution:** Check that `.env.local` exists with `ESPOCRM_API_KEY` set

### Issue: Connection refused

**Solution:** Netlify dev server not running. Start with `netlify dev`

### Issue: Empty response

**Solution:** Check function logs for errors. The function might be crashing.
