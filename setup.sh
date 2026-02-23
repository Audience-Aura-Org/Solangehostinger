#!/bin/bash

# Solange Hair Braiding - Quick Start Script
# This script helps you get started with the project locally

set -e

echo "🚀 Solange Hair Braiding - Project Setup"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Create environment file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from template..."
    cp .env.local.example .env.local
    echo "✅ Created .env.local"
    echo ""
    echo "⚠️  Please update .env.local with your API keys:"
    echo "   - Stripe Publishable Key"
    echo "   - PayPal Client ID"
    echo "   - Tawk.to ID"
    echo ""
fi

# Build the project
echo "🔨 Building project..."
npm run build
echo "✅ Build complete"
echo ""

echo "=========================================="
echo "✨ All set! Next steps:"
echo ""
echo "1. Update .env.local with your API keys"
echo "2. Run 'npm run dev' to start development server"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "📚 For help, see:"
echo "   - README.md (project documentation)"
echo "   - DEPLOYMENT.md (how to deploy)"
echo "   - HOSTINGER_DEPLOYMENT.md (Hostinger guide)"
echo ""
echo "🎉 Happy coding!"
