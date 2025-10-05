#!/bin/bash

# Create necessary directories if they don't exist
mkdir -p frontend/src/components/common
mkdir -p frontend/src/pages
mkdir -p frontend/src/services
mkdir -p frontend/src/hooks
mkdir -p frontend/src/utils
mkdir -p frontend/src/config

# Move components to pages directory
mv frontend/src/components/Login.jsx frontend/src/pages/Login.jsx 2>/dev/null || true
mv frontend/src/components/Signup.jsx frontend/src/pages/Signup.jsx 2>/dev/null || true
mv frontend/src/components/Upload.jsx frontend/src/pages/Upload.jsx 2>/dev/null || true
mv frontend/src/components/Subscribe.jsx frontend/src/pages/Subscribe.jsx 2>/dev/null || true

# Create .env files from examples if they don't exist
[ ! -f frontend/.env ] && cp frontend/.env.example frontend/.env 2>/dev/null || true
[ ! -f backend/.env ] && cp backend/.env.example backend/.env 2>/dev/null || true

# Update package.json scripts
echo "Migration script completed. Please update imports in your components manually."
echo "Remember to run 'npm install' in both frontend and backend directories."