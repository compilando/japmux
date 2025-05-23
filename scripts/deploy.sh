#!/bin/bash

# JAPMUX Simple Production Deployment Script
set -e

echo "🚀 Starting JAPMUX simple deployment..."

# Build the Docker image
echo "🔨 Building JAPMUX image..."
docker build -t japmux:latest .

# Stop and remove existing container if it exists
echo "🛑 Stopping existing container..."
docker stop japmux 2>/dev/null || true
docker rm japmux 2>/dev/null || true

# Start the new container
echo "🚀 Starting JAPMUX container..."
docker run -d \
  --name japmux \
  --restart unless-stopped \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-http://localhost:8000} \
  japmux:latest

# Wait for container to be ready
echo "⏳ Waiting for application to be ready..."
sleep 5

# Check if container is running
echo "🔍 Checking container status..."
if docker ps | grep -q japmux; then
    echo "✅ Container is running!"
else
    echo "❌ Container failed to start!"
    docker logs japmux
    exit 1
fi

# Test health endpoint
echo "🏥 Testing health endpoint..."
sleep 5
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ Health check passed!"
else
    echo "❌ Health check failed!"
    echo "Check logs with: docker logs japmux"
    exit 1
fi

echo "🎉 Deployment completed successfully!"
echo "Your application is available at: http://localhost:3000"
echo ""
echo "Useful commands:"
echo "  View logs: docker logs -f japmux"
echo "  Stop container: docker stop japmux"
echo "  Remove container: docker rm japmux" 