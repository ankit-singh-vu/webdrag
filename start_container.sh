#!/bin/bash

# Accept username and port as parameters
USER=$1
PORT=$2

# Check if the port is valid
if [ "$PORT" -lt 1024 ] || [ "$PORT" -gt 65535 ]; then
    echo "Error: Port number must be between 1024 and 65535."
    exit 1
fi

# Run the container with the correct port mapping
docker run -d -p $PORT:80 \
    -v $(pwd)/websites/$USER:/var/www/vvveb/public \
    --name vvvebjs_$USER vvveb/vvvebjs

echo "Container for $USER running at http://localhost:$PORT"
