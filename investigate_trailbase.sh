#!/bin/bash
set -e

echo "=== INVESTIGATING TRAILBASE CONFIGURATION ==="
echo ""

echo "1. Checking Trailbase admin UI..."
curl -s http://localhost:4000/admin 2>&1 | head -20 || echo "No admin UI at /admin"
echo ""

echo "2. Checking Trailbase health endpoint..."
curl -s http://localhost:4000/health 2>&1 || echo "No /health endpoint"
echo ""

echo "3. Listing all available endpoints..."
curl -s http://localhost:4000/ | head -50 || echo "Cannot list root"
echo ""

echo "4. Checking Record API configuration..."
cat traildepot/config.textproto
echo ""

echo "5. Checking if migrations were actually applied..."
sqlite3 traildepot/data/main.db ".tables"
echo ""

echo "6. Trailbase process info..."
ps aux | grep trail | grep -v grep || echo "Trailbase not found"
