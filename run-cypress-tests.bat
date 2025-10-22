@echo off
echo =====================================
echo Student Logs - UVU Practicum Test Runner
echo =====================================

REM Install dependencies if needed
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo Dependencies installed successfully.
)

REM Start the server in the background using start /b
echo Starting json-server on http://localhost:3000
start /b cmd /c "npm run server"

REM Wait for server to start
echo Waiting for server to start...
timeout /t 3 /nobreak >nul

echo =====================================
echo Running Cypress Tests
echo =====================================

REM Run Cypress tests
npx cypress run

REM Capture exit code from Cypress
set TEST_EXIT_CODE=%ERRORLEVEL%

REM Kill any running json-server processes
echo Stopping json-server...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo =====================================
if %TEST_EXIT_CODE% EQU 0 (
    echo All tests passed successfully! 🎉
) else (
    echo Some tests failed. Please check the output above.
)
echo =====================================

REM Exit with the same code as Cypress
exit /b %TEST_EXIT_CODE%