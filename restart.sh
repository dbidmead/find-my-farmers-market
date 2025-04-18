#!/bin/bash

echo "Killing all running Next.js instances..."
pkill -f "next dev" || echo "No Next.js processes found"

echo "Clearing cache and temporary files..."
rm -rf .next out node_modules/.cache

echo "Starting development server on port 3000..."
npm run dev 