#!/bin/bash

# Example script to: 
# 1. Authenticate to an API and get an access token.
# 2. Use the token to call the prompt serving API.

# --- Configuration (USER MUST MODIFY THESE) --- 
LOGIN_ENDPOINT_URL="http://localhost:3001/api/auth/login" # VERIFY: Your API's login endpoint
USERNAME="test@example.com"          # VERIFY: Your username
PASSWORD="password123"                            # VERIFY: Your password (consider env vars or prompt for security)
JQ_TOKEN_PATH=".access_token"

# Ensure jq is installed: (e.g., sudo apt install jq / brew install jq)
if ! command -v jq &> /dev/null
then
    echo "jq could not be found, please install it." 
    exit 1
fi

echo "Step 1: Authenticating to $LOGIN_ENDPOINT_URL..."
# Construct JSON payload safely for login
JSON_LOGIN_PAYLOAD=$(printf '{"email":"%s","password":"%s"}' "$USERNAME" "$PASSWORD")

echo "Using login payload: $JSON_LOGIN_PAYLOAD" # Imprimir el payload para depuración

AUTH_RESPONSE=$(curl -s -X POST "$LOGIN_ENDPOINT_URL"   -H "Content-Type: application/json"   -d "$JSON_LOGIN_PAYLOAD")

TOKEN=$(echo "$AUTH_RESPONSE" | jq -r "$JQ_TOKEN_PATH")

if [ -z "$TOKEN" ] || [ "$TOKEN" == "null" ]; then
  echo "Error: Authentication failed or token not found."
  echo "Login URL: $LOGIN_ENDPOINT_URL"
  echo "Response: $AUTH_RESPONSE"
  echo "Please check your credentials, LOGIN_ENDPOINT_URL, and JQ_TOKEN_PATH."
  exit 1
fi
echo "Authentication successful. Token obtained."

echo "Step 2: Calling the Prompt Serving API..."
API_RESPONSE=$( curl -s -X POST "http://localhost:3001/api/serve-prompt/execute/invoice-extraction-project/Extract%20Invoice%20Data/v1.0.0/base" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "variables": {}
}' )

echo "API Call Complete."
echo "Response:"
if echo "$API_RESPONSE" | jq . &> /dev/null; then
    echo "$API_RESPONSE" | jq .
else
    echo "Warning: API response is not valid JSON or jq failed. Displaying raw response:"
    echo "$API_RESPONSE"
fi
