# Docker Configuration for JAPMUX - Simplified

This documentation describes the simplified Docker configuration for the JAPMUX project, designed for easy deployment without additional complexity.

## 🏗️ Simple Architecture

The simplified Docker configuration includes:

- **Frontend**: Next.js 15 application with TypeScript
- **Single Container**: Self-contained application running on port 3000
- **No Dependencies**: No external services required

## 📁 File Structure

```
├── Dockerfile                 # Production Dockerfile
├── Dockerfile.dev            # Development Dockerfile
├── .dockerignore             # Files excluded from build context
├── scripts/
│   ├── deploy.sh             # Simple deployment script
│   └── dev.sh                # Development script
└── env.example               # Environment variables example
```

## 🚀 Production Deployment

### Prerequisites

1. **Docker** installed
2. **Environment variables** configured (optional)

### Quick Start

```bash
# Build and deploy in one command
./scripts/deploy.sh

# Or manually
docker build -t japmux:latest .
docker run -d --name japmux -p 3000:3000 japmux:latest
```

### Environment Variables (Optional)

```bash
# Set API URL if needed
docker run -d \
  --name japmux \
  -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://your-api-server:8000 \
  japmux:latest
```

### Verification

```bash
# Check if container is running
docker ps

# View logs
docker logs japmux

# Test health check
curl http://localhost:3000/api/health
```

## 🛠️ Local Development

### Quick Start

```bash
# Start development environment
./scripts/dev.sh

# Or manually
docker build -f Dockerfile.dev -t japmux:dev .
docker run -it -p 3000:3000 -v $(pwd):/app japmux:dev
```

### Development Features

- **Hot Reload**: Code changes reflected automatically
- **Volume Mounting**: Source code mounted for real-time development
- **Port 3000**: Application accessible at http://localhost:3000

## 🔧 Available Commands

### NPM Scripts

```bash
# Development
npm run docker:dev        # Start development container

# Production
npm run docker:build      # Build production image
npm run docker:run        # Run production container
npm run docker:deploy     # Full deployment script

# Management
npm run docker:logs       # View container logs
npm run docker:stop       # Stop container
npm run docker:clean      # Clean up Docker resources
```

### Direct Docker Commands

```bash
# Build image
docker build -t japmux:latest .

# Run container
docker run -d --name japmux -p 3000:3000 japmux:latest

# View logs
docker logs -f japmux

# Stop and remove
docker stop japmux
docker rm japmux
```

## 🔒 Security Features

- **Non-root user**: Application runs as `nextjs` user
- **Minimal image**: Alpine Linux base for smaller attack surface
- **Health checks**: Built-in application monitoring
- **No exposed services**: Only the application port is exposed

## 📊 Health Monitoring

### Health Check Endpoint

The application includes a health check endpoint at `/api/health`:

```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00Z",
  "uptime": 123.45,
  "environment": "production",
  "version": "2.0.2",
  "checks": {
    "api": "ok",
    "memory": {...}
  }
}
```

### Container Health

Docker automatically monitors container health:

```bash
# Check health status
docker inspect --format='{{.State.Health.Status}}' japmux
```

## 🔍 Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Check what's using port 3000
   sudo netstat -tlnp | grep :3000
   
   # Use different port
   docker run -d --name japmux -p 3001:3000 japmux:latest
   ```

2. **Container won't start:**
   ```bash
   # Check logs for errors
   docker logs japmux
   
   # Run in interactive mode to debug
   docker run -it --name japmux-debug japmux:latest sh
   ```

3. **Build failures:**
   ```bash
   # Clean Docker cache
   docker system prune -f
   
   # Rebuild without cache
   docker build --no-cache -t japmux:latest .
   ```

### Useful Commands

```bash
# Container management
docker ps                    # List running containers
docker ps -a                 # List all containers
docker images                # List images
docker logs -f japmux        # Follow logs
docker exec -it japmux sh    # Shell into container

# Cleanup
docker stop japmux           # Stop container
docker rm japmux             # Remove container
docker rmi japmux:latest     # Remove image
docker system prune -f       # Clean unused resources
```

## 🔄 Updates

### Update Process

1. **Stop current container:**
   ```bash
   docker stop japmux
   docker rm japmux
   ```

2. **Pull latest code and rebuild:**
   ```bash
   git pull
   docker build -t japmux:latest .
   ```

3. **Start new container:**
   ```bash
   docker run -d --name japmux -p 3000:3000 japmux:latest
   ```

### Automated Updates

Use the deployment script for easy updates:

```bash
./scripts/deploy.sh
```

## 📞 Support

For Docker-specific issues:

1. Check container logs: `docker logs japmux`
2. Verify container is running: `docker ps`
3. Test health endpoint: `curl http://localhost:3000/api/health`
4. Review this documentation for common solutions

## ✨ Benefits of Simplified Setup

- **Easy to understand**: No complex orchestration
- **Quick deployment**: Single command deployment
- **Lightweight**: Minimal resource usage
- **Portable**: Runs anywhere Docker is available
- **Debuggable**: Simple architecture makes troubleshooting easier 