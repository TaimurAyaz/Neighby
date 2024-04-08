#!/bin/bash

# Check if .env file exists
if [ ! -f .env ]; then
    echo "false"
    exit 1
fi

# Check if .env file is empty
if [ ! -s .env ]; then
    echo "false"
    exit 1
else
    echo "true"
    exit 0
fi