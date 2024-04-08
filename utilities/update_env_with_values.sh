#!/bin/bash

# Function to update variable in .env file
update_variable() {
    local variable_name="$1"
    local value="$2"
    local tmp_file=$(mktemp .env.neighby.XXXXXX)
    
    # Update the variable in .env file
    awk -v var="$variable_name" -v val="$value" 'BEGIN { FS="="; OFS="=" } $1 == var && $2 == "" { $2=val } 1' "$env_file" > "$tmp_file" && mv "$tmp_file" "$env_file"
}

# Check if .env file exists
env_file=".env"
if [ ! -f "$env_file" ]; then
    exit 1
fi

# Check if there are any unset variables provided as arguments
if [ "$#" -eq 0 ]; then
    echo "Usage: $0 <unset_variable1> <unset_variable2> ..."
    exit 1
fi

unset_variables=("$@")

# Output unset variables
for var in "${unset_variables[@]}"; do
    read -p "🔶 Enter value for $var: " input_value
    update_variable "$var" "$input_value"
done