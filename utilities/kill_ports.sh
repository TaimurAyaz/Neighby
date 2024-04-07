#!/bin/bash

# Check if the .env file exists
if [ ! -f "$1" ]; then
    echo ".env file not found"
    exit 1
fi

# Extract variables ending with "_PORT" and process them
grep "_PORT=" "$1" | while IFS='=' read -r var_name var_value; do
    # Extract the port number
    port="${var_value}"

    # Check if the port number is numeric
    if [[ $port =~ ^[0-9]+$ ]]; then
        # Find and kill processes listening on the port
        lsof -ti:"$port" | xargs kill
        echo "Killed processes listening on port $port"
    else
        echo "Invalid port number: $port"
    fi
done
