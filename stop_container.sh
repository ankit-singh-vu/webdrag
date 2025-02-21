#!/bin/bash
CONTAINER_NAME=$1

# Stop and remove the Docker container
docker stop $CONTAINER_NAME
docker rm -v $CONTAINER_NAME
