#!/bin/bash

echo "🚀 Setting up Talkit..."

# Backend setup
echo "📦 Installing backend dependencies..."
cd backend
npm install
cp .env.example .env
echo "✅ Backend setup complete"

# Web setup
echo "📦 Installing web dependencies..."
cd ../web
npm install
echo "✅ Web setup complete"

echo ""
echo "✨ Talkit setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with your MongoDB URI"
echo "2. Start backend: cd backend && npm run dev"
echo "3. Start web: cd web && npm run dev"
echo ""
echo "🎉 Happy coding!"
