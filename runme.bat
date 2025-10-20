@echo off
echo =====================================
echo Student Logs - UVU Practicum Runner
echo =====================================

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Node.js is not installed. Please install Node.js to run this project.
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: npm is not installed. Please install npm to run this project.
    exit /b 1
)

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo Dependencies installed successfully.
)

REM Start the server
echo Starting json-server on http://localhost:3000
echo Press Ctrl+C to stop the server
echo =====================================

REM Open browser on Windows
start http://localhost:3000

REM Run the server
npx json-server db.json