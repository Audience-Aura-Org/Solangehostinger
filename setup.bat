@echo off
REM Solange Hair Braiding - Quick Start Script (Windows)
REM This script helps you get started with the project locally

setlocal enabledelayedexpansion

echo.
echo Solange Hair Braiding - Project Setup
echo ======================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version

echo ✅ npm version:
npm --version
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install
echo ✅ Dependencies installed
echo.

REM Create environment file if it doesn't exist
if not exist .env.local (
    echo 📝 Creating .env.local from template...
    copy .env.local.example .env.local >nul 2>&1
    echo ✅ Created .env.local
    echo.
    echo ⚠️  Please update .env.local with your API keys:
    echo    - Stripe Publishable Key
    echo    - PayPal Client ID
    echo    - Tawk.to ID
    echo.
)

REM Build the project
echo 🔨 Building project...
call npm run build
echo ✅ Build complete
echo.

echo ======================================
echo ✨ All set! Next steps:
echo.
echo 1. Update .env.local with your API keys
echo 2. Run 'npm run dev' to start development server
echo 3. Open http://localhost:3000 in your browser
echo.
echo 📚 For help, see:
echo    - README.md (project documentation)
echo    - DEPLOYMENT.md (how to deploy)
echo    - HOSTINGER_DEPLOYMENT.md (Hostinger guide)
echo.
echo 🎉 Happy coding!
echo.
pause
