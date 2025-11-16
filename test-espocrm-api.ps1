# Test EspoCRM API - PowerShell 5.1 Compatible
# This script POSTs a lead directly to EspoCRM

Write-Host ""
Write-Host "=== TESTING ESPOCRM API DIRECTLY ===" -ForegroundColor Cyan
Write-Host ""

# Load environment variables from .env.local
Write-Host "Step 1: Loading Environment Variables" -ForegroundColor Yellow
Write-Host "----------------------------------------"

$envFile = ".\.env.local"
if (Test-Path $envFile)
{
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$')
        {
            $name = $matches[1]
            $value = $matches[2]
            Set-Item -Path "env:$name" -Value $value
        }
    }
    Write-Host "Loaded .env.local" -ForegroundColor Green
}
else
{
    Write-Host ".env.local not found!" -ForegroundColor Red
    exit 1
}

$ESPOCRM_URL = $env:ESPOCRM_URL
if (-not $ESPOCRM_URL) { $ESPOCRM_URL = "https://crm.challengers.tech" }
$ESPOCRM_API_KEY = $env:ESPOCRM_API_KEY

Write-Host "ESPOCRM_URL: $ESPOCRM_URL"
if ($ESPOCRM_API_KEY)
{
    $keyPreview = $ESPOCRM_API_KEY.Substring(0, 8)
    Write-Host "ESPOCRM_API_KEY: ${keyPreview}..." -ForegroundColor Green
}
else
{
    Write-Host "ESPOCRM_API_KEY: NOT SET" -ForegroundColor Red
    exit 1
}

# Prepare lead data
Write-Host ""
Write-Host "Step 2: Preparing Lead Data" -ForegroundColor Yellow
Write-Host "----------------------------------------"

$timestamp = [DateTimeOffset]::Now.ToUnixTimeSeconds()
$leadDataObject = @{
    firstName    = "PowerShell"
    lastName     = "Test"
    emailAddress = "powershell-test-$timestamp@example.com"
    phoneNumber  = "+1 555-9999"
    accountName  = "PowerShell Test Corp"
    title        = "QA Engineer"
    description  = "Test submission from PowerShell script"
    source       = "Web Site"
    status       = "New"
    website      = ""
}

$leadData = $leadDataObject | ConvertTo-Json
Write-Host $leadData

# Send to EspoCRM API
Write-Host ""
Write-Host "Step 3: Sending to EspoCRM API" -ForegroundColor Yellow
Write-Host "----------------------------------------"

$endpoint = "$ESPOCRM_URL/api/v1/Lead"
Write-Host "Endpoint: $endpoint"

$headers = @{
    "Content-Type"  = "application/json"
    "X-Api-Key"     = $ESPOCRM_API_KEY
    "Authorization" = "ApiKey $ESPOCRM_API_KEY"
}

try
{
    $response = Invoke-RestMethod -Uri $endpoint -Method Post -Headers $headers -Body $leadData -ErrorAction Stop

    Write-Host ""
    Write-Host "SUCCESS! Lead created in EspoCRM" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Lead ID: $($response.id)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Lead Data:" -ForegroundColor Yellow
    $response | ConvertTo-Json -Depth 3
    Write-Host ""
    Write-Host "View in EspoCRM:" -ForegroundColor Yellow
    Write-Host "$ESPOCRM_URL/#Lead/view/$($response.id)" -ForegroundColor Cyan
}
catch
{
    Write-Host ""
    Write-Host "ERROR: Failed to create lead" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red

    if ($_.Exception.Response)
    {
        $statusCode = $_.Exception.Response.StatusCode.value__
        $statusDesc = $_.Exception.Response.StatusDescription
        Write-Host "Status Code: $statusCode" -ForegroundColor Red
        Write-Host "Status Description: $statusDesc" -ForegroundColor Red
    }

    if ($_.ErrorDetails.Message)
    {
        Write-Host ""
        Write-Host "Error Details:" -ForegroundColor Yellow
        Write-Host $_.ErrorDetails.Message
    }

    Write-Host ""
    Write-Host "Full Error:" -ForegroundColor Yellow
    Write-Host $_.Exception.Message
}

Write-Host ""
Write-Host "=== TEST COMPLETE ===" -ForegroundColor Cyan
Write-Host ""
