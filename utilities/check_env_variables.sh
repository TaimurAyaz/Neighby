#!/bin/bash

# Check if .env file exists
if [ ! -f .env ]; then
    echo ".env file does not exist."
    exit 1
fi

# Array to store variables without values
unset_variables=()

# Read .env file line by line
while IFS= read -r line || [[ -n "$line" ]]; do
    # Check if line is not empty and does not start with #
    if [[ -n "$line" && ! "$line" =~ ^\s*# ]]; then
        # Extract variable name
        variable_name=$(echo "$line" | cut -d '=' -f 1)
        # Extract value
        value=$(echo "$line" | cut -d '=' -f 2-)
        # Check if value is empty
        if [ -z "$value" ]; then
            unset_variables+=("$variable_name")
        fi
    fi
done < .env

# Output unset variables
for var in "${unset_variables[@]}"; do
    echo "$var"
done
