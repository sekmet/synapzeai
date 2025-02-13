#!/bin/bash
# This script copies files or directories from a local path into a Docker container.
# Usage: ./docker_cp.sh <srcpath> <containerid> <destpath>

# Check if exactly three arguments are provided
if [ "$#" -ne 3 ]; then
    echo "Usage: $0 <srcpath> <containerid> <destpath>"
    exit 1
fi

srcpath="$1"
containerid="$2"
destpath="$3"

# Check if the source path exists (can be a file or directory)
if [ ! -e "$srcpath" ]; then
    echo "Error: Source path '$srcpath' does not exist."
    exit 1
fi

# Execute the docker cp command
docker cp "$srcpath" "${containerid}:${destpath}"

# Check if the command was successful
if [ "$?" -eq 0 ]; then
    echo "Successfully copied '$srcpath' to container '$containerid' at '$destpath'."
else
    echo "Error: Failed to copy '$srcpath' to container '$containerid'."
    exit 1
fi
