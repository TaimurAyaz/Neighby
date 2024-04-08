#!/bin/bash

# Check if .env file exists
if [ -f .env ]; then
    echo "true"
else
    # Check if .env.example exists
    if [ -f .env.example ]; then
        # Copy .env.example to .env
        cp .env.example .env
        echo "true"
    else
        echo "false"
    fi
fi