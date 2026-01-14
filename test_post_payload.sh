#!/bin/bash

echo "Testing POST with various payloads..."
echo ""

# Test 1: Empty JSON
echo "=== Test 1: Empty object {} ==="
curl -s -w "Status: %{http_code}\n" -X POST http://localhost:4000/api/records/v1/prompts \
  -H "Content-Type: application/json" \
  -d '{}' 
echo ""

# Test 2: Minimal required fields
echo "=== Test 2: With all required fields ==="
curl -s -w "\nStatus: %{http_code}\n" -X POST http://localhost:4000/api/records/v1/prompts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Prompt",
    "text": "This is a test",
    "id": "test-001",
    "created_at": 1705279801000,
    "updated_at": 1705279801000
  }' 2>&1 | head -20
echo ""

# Test 3: Let backend generate ID
echo "=== Test 3: Without ID ==="
curl -s -w "\nStatus: %{http_code}\n" -X POST http://localhost:4000/api/records/v1/prompts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Prompt 2",
    "text": "Another test"
  }' 2>&1 | head -20
