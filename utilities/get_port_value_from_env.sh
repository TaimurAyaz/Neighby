#!/bin/bash

# Check if the .env file exists
if [ ! -f "$1" ]; then
    echo ".env file not found"
    exit 1
fi

# Check if prefix argument is provided
if [ -z "$2" ]; then
    echo "Please provide a prefix as the second argument"
    exit 1
fi

# Extract prefix from the second argument
prefix="$2"

# Read variables from .env file and find the value of the variable with specified prefix ending in "_PORT"
value=$(grep "^$prefix.*_PORT=" "$1" | cut -d '=' -f 2)

# Check if the value is found
if [ -z "$value" ]; then
    echo "No variable found with prefix $prefix ending in '_PORT'"
else
    echo "$value"
fi
