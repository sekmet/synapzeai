#!/bin/bash
# This script changes the directory to where the given file is located,
# runs "docker compose down -v",
# and then deletes the directory containing the file.

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

# Change back to the parent directory before deleting the target directory
cd .. || { echo "Error: Unable to change directory to the parent of $DIR"; exit 1; }

# Delete the directory containing the file
rm -rf "$DIR"
echo "Deleted directory: $DIR"
