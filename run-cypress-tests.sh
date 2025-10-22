#!/bin/bash

# Script to run the json-server and Cypress tests for the UVU Student Logs project
echo "====================================="
echo "Student Logs - UVU Practicum Test Runner"
echo "====================================="

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    echo "Dependencies installed successfully."
fi

# Start the server in the background
echo "Starting json-server on http://localhost:3000"
npm run server &
SERVER_PID=$!

# Wait for server to start
echo "Waiting for server to start..."
sleep 3

echo "====================================="
echo "Running Cypress Tests"
echo "====================================="

# Run Cypress tests
npx cypress run

# Capture exit code from Cypress
TEST_EXIT_CODE=$?

# Kill the server process
echo "Stopping json-server..."
kill $SERVER_PID

echo "====================================="
if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo "All tests passed successfully! 🎉"
else
    echo "Some tests failed. Please check the output above."
fi
echo "====================================="

# Exit with the same code as Cypress
exit $TEST_EXIT_CODE