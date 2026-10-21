#!/usr/bin/env bash

# HorizonCapital — Growth Readiness Engine
# One-Click Localhost Starter for macOS / Linux / WSL

echo "========================================================"
echo "   HorizonCapital - Growth Readiness Engine"
echo "   One-Click Localhost Starter & Dev Environment"
echo "========================================================"
echo ""

# 1. Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed!"
    echo "Please install Node.js (v18 or higher) from: https://nodejs.org/"
    exit 1
fi

echo "[INFO] Detected Node.js: $(node -v)"
echo "[INFO] Detected NPM:     $(npm -v)"
echo ""

# 2. Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "[SETUP] First-time setup detected. Installing packages..."
    npm install
    if [ $? -ne 0 ]; then
        echo "[ERROR] npm install failed. Please check your connection."
        exit 1
    fi
    echo "[SUCCESS] Dependencies installed!"
    echo ""
fi

# 3. Launch Vite development server
echo "[RUNNING] Starting HorizonCapital local dev server..."
echo "Local URL: http://localhost:5173"
echo "Press Ctrl+C to stop the server."
echo "========================================================"
echo ""

npm run dev
