@echo off
echo =====================================
echo Student Logs - UVU Practicum Runner
echo =====================================

REM Install dependencies if needed
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
call npm run server