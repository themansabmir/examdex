# Docker Setup & CI/CD Pipeline

This document explains the Docker setup and CI/CD pipeline for the ExamDex monorepo.

## 🐳 Docker Services

### Services Overview

1. **API Service** (`apps/api`)
   - Node.js/Express application
   - Port: 3000
   - Multi-stage build with pnpm

2. **Dashboard Service** (`apps/dashboard`)
   - React/Vite frontend
   - Port: 80 (served via nginx)
   - Optimized build with nginx reverse proxy

3. **RAG Service** (`apps/rag`)
   - Python/FastAPI application
   - Port: 8000
   - Uses Python 3.11 slim image

4. **PostgreSQL Database**
   - Port: 5432
   - Version: 15-alpine
   - Persistent data volume

5. **Redis Cache**
   - Port: 6379
   - Version: 7-alpine
   - Persistent data volume

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Git repository cloned

### Development Setup

1. **Start all services:**

   ```bash
   docker-compose up -d
   ```

2. **View logs:**

   ```bash
   docker-compose logs -f
   ```

3. **Stop services:**

   ```bash
   docker-compose down
   ```

4. **Stop with volume cleanup:**
   ```bash
   docker-compose down -v
   ```

### Service URLs

- **Dashboard**: http://localhost:80
- **API**: http://localhost:3000
- **RAG Service**: http://localhost:8000
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

The CI/CD pipeline triggers on:

- Pull requests to `dev` or `main` branches
- Pushes to `dev` or `main` branches

### Pipeline Stages

1. **Test & Lint**
   - Runs linting, type checking, and tests
   - Uses pnpm for package management

2. **Build & Push Docker Images**
   - Builds multi-platform Docker images (amd64/arm64)
   - Pushes to GitHub Container Registry (ghcr.io)
   - Uses build cache for faster builds

3. **Security Scanning**
   - Runs Trivy vulnerability scanner
   - Uploads results to GitHub Security tab

4. **Integration Tests**
   - Starts services with Docker Compose
   - Runs health checks on all services
   - Cleans up after tests

5. **Deployment**
   - **Staging**: Auto-deploys on `dev` branch push
   - **Production**: Auto-deploys on `main` branch push

### Image Naming Convention

Images are tagged as:

- `ghcr.io/your-org/examdex/{service}:{branch}-{sha}`
- `ghcr.io/your-org/examdex/{service}:latest` (for main branch)

Example:

- `ghcr.io/themansabmir/examdex/api:dev-a1b2c3d4`
- `ghcr.io/themansabmir/examdex/dashboard:main-e5f6g7h8`

## 🔧 Configuration

### Environment Variables

#### API Service

- `NODE_ENV`: production
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string

#### RAG Service

- `PYTHONPATH`: /app
- `REDIS_URL`: Redis connection string

### Health Checks

All services include health checks:

- **API**: HTTP GET `/health`
- **Dashboard**: HTTP GET `/`
- **RAG**: HTTP GET `/health`
- **PostgreSQL**: `pg_isready`
- **Redis**: `redis-cli ping`

## 🛠️ Development Workflow

### Local Development

1. **Make changes to your code**
2. **Rebuild specific service:**
   ```bash
   docker-compose build api
   ```
3. **Restart service:**
   ```bash
   docker-compose up -d api
   ```

### Production Deployment

1. **Merge to `main` branch**
2. **CI/CD pipeline automatically:**
   - Builds and tests
   - Pushes Docker images
   - Deploys to production

### Staging Deployment

1. **Push to `dev` branch**
2. **CI/CD pipeline automatically:**
   - Builds and tests
   - Pushes Docker images
   - Deploys to staging

## 🔍 Monitoring & Debugging

### View Service Status

```bash
docker-compose ps
```

### View Service Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
```

### Access Service Shell

```bash
docker-compose exec api sh
docker-compose exec dashboard sh
docker-compose exec rag sh
```

### Database Access

```bash
docker-compose exec postgres psql -U examdex -d examdex
```

### Redis Access

```bash
docker-compose exec redis redis-cli
```

## 🚨 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 80, 3000, 5432, 6379, 8000 are free
2. **Permission issues**: Run with appropriate Docker permissions
3. **Build failures**: Check `.dockerignore` and Dockerfile paths
4. **Health check failures**: Verify service startup logs

### Reset Environment

```bash
# Stop and remove all containers, networks, volumes
docker-compose down -v --remove-orphans

# Remove all Docker images
docker system prune -a
```

## 📝 Notes

- The `.dockerignore` file excludes unnecessary files from build context
- Multi-stage builds optimize image sizes
- All services run as non-root users for security
- Health checks ensure service reliability
- Network isolation via custom Docker network
