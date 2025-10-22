#!/bin/bash

# Simple script to run the json-server for the UVU Student Logs project
echo "====================================="
echo "Student Logs - UVU Practicum Runner"
echo "====================================="

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    echo "Dependencies installed successfully."
fi

# Start the server
echo "Starting json-server on http://localhost:3000"
echo "Press Ctrl+C to stop the server"
echo "====================================="

# Open browser (Mac only)
if [[ "$OSTYPE" == "darwin"* ]]; then
    open http://localhost:3000 &
    echo "Opening browser..."
fi

# Run the server
npm run server