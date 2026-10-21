@echo off
setlocal enabledelayedexpansion

echo ========================================================
echo    HorizonCapital - Growth Readiness Engine
echo    One-Click Localhost Starter & Dev Environment
echo ========================================================
echo.

:: 1. Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not found on your system!
    echo Please download and install Node.js (LTS version) from:
    echo   https://nodejs.org/
    echo.
    echo Press any key to open the download page in your browser...
    pause >nul
    start https://nodejs.org/
    exit /b 1
)

:: Display Node and NPM versions
echo [INFO] Detected Node.js:
node -v
echo [INFO] Detected NPM:
call npm -v
echo.

:: 2. Check if dependencies are installed
if not exist "node_modules\" (
    echo [SETUP] First-time setup detected. Installing dependencies...
    echo This may take 30-60 seconds depending on your connection.
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies. Please check your internet connection.
        pause
        exit /b 1
    )
    echo [SUCCESS] Dependencies installed successfully!
    echo.
)

:: 3. Launch the development server
echo [RUNNING] Starting HorizonCapital local dev server...
echo Local URL:    http://localhost:5173
echo Your browser will open automatically. Press Ctrl+C in this window to stop.
echo ========================================================
echo.

call npm run dev

if %errorlevel% neq 0 (
    echo.
    echo [NOTICE] If you encounter a PowerShell ExecutionPolicy error,
    echo run this script using Command Prompt (cmd.exe) or run:
    echo   npm.cmd run dev
    echo.
    pause
)
