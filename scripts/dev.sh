#!/bin/bash

# JAPMUX Simple Development Script
set -e

echo "🚀 Starting JAPMUX development environment..."

# Build the development image
echo "🔨 Building development image..."
docker build -f Dockerfile.dev -t japmux:dev .

# Stop and remove existing development container if it exists
echo "🛑 Stopping existing development container..."
docker stop japmux-dev 2>/dev/null || true
docker rm japmux-dev 2>/dev/null || true

# Start the development container with volume mounting
echo "🚀 Starting development container..."
docker run -it \
  --name japmux-dev \
  -p 3000:3000 \
  -e NODE_ENV=development \
  -e NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-http://localhost:8000} \
  -v $(pwd):/app \
  -v /app/node_modules \
  -v /app/.next \
  japmux:dev

echo "🎉 Development environment started!"
echo "Your application is available at: http://localhost:3000"