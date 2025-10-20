#!/bin/bash

# Print banner
echo "====================================="
echo "Student Logs - UVU Practicum Runner"
echo "====================================="

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js to run this project."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed. Please install npm to run this project."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    echo "Dependencies installed successfully."
fi

# Start the server
echo "Starting json-server on http://localhost:3000"
echo "Press Ctrl+C to stop the server"
echo "====================================="

# Open browser if on macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    open http://localhost:3000 &
    echo "Opening browser..."
fi

# Run the server with json-server directly
npx json-server db.json