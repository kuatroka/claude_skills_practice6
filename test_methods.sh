#!/bin/bash

echo "Testing HTTP methods on /api/records/v1/prompts..."
echo ""

for method in GET POST PUT DELETE PATCH HEAD OPTIONS TRACE; do
  status=$(curl -s -w "%{http_code}" -o /dev/null -X $method http://localhost:4000/api/records/v1/prompts)
  echo "$method → $status"
done

echo ""
echo "Checking response headers..."
curl -s -i -X HEAD http://localhost:4000/api/records/v1/prompts 2>&1 | head -20
