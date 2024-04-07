#!/bin/bash

# Check if the source .env file exists
if [ ! -f "$1" ]; then
    echo "Source .env file not found"
    exit 1
fi

# Check if a prefix is provided as an argument
if [ -z "$2" ]; then
    echo "Please provide a prefix as the second argument"
    exit 1
fi

# Read variables from source .env file and split by newline
source_env=$(cat "$1")
IFS=$'\n'

# Extract prefix from the second argument
prefix=$2

# Create a new .env file with variables having the specified prefix
new_env_file="$prefix.env"
echo "# .env file generated for prefix: $prefix" > "$new_env_file"
for line in $source_env; do
    # Extract variable name and value
    var_name=$(echo "$line" | cut -d '=' -f 1)
    var_value=$(echo "$line" | cut -d '=' -f 2-)

    # Check if variable name starts with the specified prefix
    if [[ "$var_name" == "${prefix}_"* ]]; then
        # Remove the prefix from the variable name
        trimmed_var_name=$(echo "$var_name" | sed "s/^${prefix}_//")
        echo "$trimmed_var_name=$var_value" >> "$new_env_file"
    fi
done

echo "New .env file created successfully: $new_env_file"
