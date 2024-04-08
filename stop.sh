#!/bin/bash

indent_output() {
    # Run the command and redirect output to a temporary file
    temp_file=$(mktemp)
    "$@" > "$temp_file" 2>&1
    
    # Indent and display the output
    sed 's/^/    /' "$temp_file"
    
    # Remove the temporary file
    rm "$temp_file"
}

echo "Stopping Neighby..."

indent_output echo "Stopping processes..."
indent_output pm2 delete all
indent_output pm2 kill
indent_output echo "✓ Processes stopped"

indent_output echo "Freeing ports..."
indent_output sh ./utilities/kill_ports.sh .env
indent_output echo "✓ Ports freed"

rm -rf ./local

echo "✅ Neighby stopped"