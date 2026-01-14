#!/bin/bash

echo "Testing different Record API endpoint formats..."
echo ""

# Test 1: Standard Record API endpoint without trailing slash
echo "=== Test 1: /api/records/v1/prompts (GET) ==="
curl -s -w "Status: %{http_code}\n" http://localhost:4000/api/records/v1/prompts -H "Accept: application/json"
echo ""

# Test 2: Try with auth header (might need token)
echo "=== Test 2: POST to /api/records/v1/prompts with sample data ==="
curl -s -w "Status: %{http_code}\n" -X POST http://localhost:4000/api/records/v1/prompts \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","text":"Test prompt","id":"test-1"}' 
echo ""

# Test 3: Check what the actual Record API path should be
echo "=== Test 3: /api/v1/prompts ==="
curl -s -w "Status: %{http_code}\n" http://localhost:4000/api/v1/prompts
echo ""

# Test 4: Check trailing slash
echo "=== Test 4: /api/records/v1/prompts/ (with trailing slash) ==="
curl -s -w "Status: %{http_code}\n" http://localhost:4000/api/records/v1/prompts/
echo ""

# Test 5: Check if it's a rpc endpoint
echo "=== Test 5: /rpc/records/v1/prompts ==="
curl -s -w "Status: %{http_code}\n" http://localhost:4000/rpc/records/v1/prompts
echo ""

# Test 6: Look for GraphQL or alternative APIs
echo "=== Test 6: Checking for common API patterns ==="
for endpoint in /api /graphql /query /gql /records /v1/records; do
  status=$(curl -s -w "%{http_code}" -o /dev/null http://localhost:4000$endpoint)
  echo "  $endpoint → $status"
done
