#!/bin/bash

# DeepSeek API Tester - Local Server Launcher
# This script starts a simple HTTP server to serve the web interface

echo "🚀 Starting DeepSeek API Tester Web Interface..."
echo "📍 API Target: llm.ndfreetech.me"
echo ""

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    echo "🐍 Using Python 3 HTTP Server"
    echo "🌐 Opening http://localhost:8080"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo "----------------------------------------"
    
    # Try to open browser automatically
    if command -v open &> /dev/null; then
        # macOS
        sleep 2 && open http://localhost:8080 &
    elif command -v xdg-open &> /dev/null; then
        # Linux
        sleep 2 && xdg-open http://localhost:8080 &
    elif command -v start &> /dev/null; then
        # Windows
        sleep 2 && start http://localhost:8080 &
    fi
    
    python3 -m http.server 8080
    
elif command -v python &> /dev/null; then
    echo "🐍 Using Python 2 HTTP Server"
    echo "🌐 Opening http://localhost:8080"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo "----------------------------------------"
    
    # Try to open browser automatically
    if command -v open &> /dev/null; then
        # macOS
        sleep 2 && open http://localhost:8080 &
    elif command -v xdg-open &> /dev/null; then
        # Linux
        sleep 2 && xdg-open http://localhost:8080 &
    elif command -v start &> /dev/null; then
        # Windows
        sleep 2 && start http://localhost:8080 &
    fi
    
    python -m SimpleHTTPServer 8080
    
else
    echo "❌ Python not found!"
    echo ""
    echo "Please install Python or use one of these alternatives:"
    echo ""
    echo "📦 Using Node.js:"
    echo "   npx http-server -p 8080"
    echo ""
    echo "🆚 Using VS Code:"
    echo "   1. Install 'Live Server' extension"
    echo "   2. Right-click index.html"
    echo "   3. Select 'Open with Live Server'"
    echo ""
    echo "🌐 Or open index.html directly in your browser"
    exit 1
fi
