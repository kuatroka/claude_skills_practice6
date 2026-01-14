#!/bin/bash

echo "Investigating Trailbase Record API support..."
echo ""

# Check if there's a different way to enable Record APIs
echo "1. Checking Trailbase openapi schema..."
trail openapi prompts 2>&1 | head -100 || echo "No openapi command"
echo ""

# Check the configuration structure
echo "2. Checking config parsing..."
trail run --help | grep -i config || echo "No config help"
echo ""

# Try to see if there's an environment variable for Record APIs
echo "3. Checking for Record API env variables..."
env | grep -i record || echo "No Record API env vars"
echo ""

# Check if we can query the config
echo "4. Listing Trailbase migrations..."
ls -la traildepot/migrations/main/ 2>/dev/null || echo "No migrations in main"
echo ""

# Check database schema
echo "5. Checking what tables are in the database..."
sqlite3 traildepot/data/main.db ".schema" | grep -E "CREATE TABLE|CREATE VIRTUAL"
