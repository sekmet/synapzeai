#!/bin/bash
# This script changes the directory to where the given file is located
# and runs "docker compose up -d"

# Check if a filepath was provided as an argument
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <path-to-docker-compose.yaml>"
    exit 1
fi

FILEPATH="$1"

# Verify that the file exists
if [ ! -f "$FILEPATH" ]; then
    echo "Error: File '$FILEPATH' does not exist."
    exit 1
fi

# Get the directory containing the file
DIR=$(dirname "$FILEPATH")

# Change directory to the file's directory
cd "$DIR" || { echo "Error: Unable to change directory to $DIR"; exit 1; }

# Execute docker compose command
docker compose up -d 2>&1
