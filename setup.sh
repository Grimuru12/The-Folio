#!/bin/bash
# Setup script for fresh installation

echo "Installing dependencies..."

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies  
npm install

echo "✅ Dependencies installed!"
echo ""
echo "To run locally:"
echo "  Backend: cd backend && npm start"
echo "  Frontend: npm start"
echo ""
echo "To deploy: See DEPLOY_NOW.md"
