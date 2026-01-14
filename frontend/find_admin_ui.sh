#!/bin/bash
for path in /admin /dashboard /_admin /.admin /ui /api/admin; do
  code=$(curl -s -w "%{http_code}" -o /dev/null "http://localhost:4000$path")
  echo "$path → $code"
done
