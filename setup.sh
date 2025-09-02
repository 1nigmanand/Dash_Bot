#!/bin/bash

# DeepSeek React Chatbot Setup Script
echo "🤖 Setting up DeepSeek React Chatbot..."
echo "📦 This will install React, TypeScript, Tailwind CSS and dependencies"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first:"
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Setup complete!"
    echo ""
    echo "🚀 To start the development server:"
    echo "   npm start"
    echo ""
    echo "🔧 Available scripts:"
    echo "   npm start    - Start development server"
    echo "   npm run build - Build for production"
    echo "   npm test     - Run tests"
    echo ""
    echo "🌐 The app will open at: http://localhost:3000"
    echo "🔗 API Target: https://llm.ndfreetech.me"
    echo ""
    
    # Ask if user wants to start the dev server
    read -p "🚀 Start the development server now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🎬 Starting development server..."
        npm start
    fi
else
    echo ""
    echo "❌ Installation failed. Please check the error messages above."
    echo "💡 You may need to:"
    echo "   - Check your internet connection"
    echo "   - Clear npm cache: npm cache clean --force"
    echo "   - Try installing again: npm install"
    exit 1
fi
