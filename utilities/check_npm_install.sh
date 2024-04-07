#!/bin/bash

# Directory to check for node_modules
directory="$1"

# Check if directory is provided
if [ -z "$directory" ]; then
    echo "Usage: $0 <directory>"
    exit 1
fi

# Check if node_modules directory exists
if [ ! -d "$directory/node_modules" ]; then
    echo "💬 node_modules directory not found. Running npm install..."
    # Change directory to the specified directory
    cd "$directory" || exit
    # Run npm install
    npm install
fi

echo "✓ $directory dependencies installed."