# ExamDex Setup Guide

## Prerequisites

- Node.js (v18+)
- pnpm (v9.0.0)

## Install pnpm (if not already installed)

```bash
# Using Homebrew (recommended for Mac)
brew install pnpm

# Or using npm
npm install -g pnpm

# Or using curl
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

Verify installation:

```bash
pnpm --version
```

## Initial Setup

```bash
# Install dependencies
pnpm install
```

## Database Setup

This project is configured to use a **Containerized Database** for development infrastructure, while the Application runs locally.

### 1. Start Infrastructure (Postgres + Redis)

```bash
docker-compose up -d
```

_This starts a PostgreSQL database on port `5432` and Redis on `6379`._

### 2. Configure Application

Ensure your `apps/api/.env` file points to this local database container:

```bash
DATABASE_URL="postgresql://examdex:examdex_dev_password@localhost:5432/examdex?schema=public"
```

### 3. Initialize Database

```bash
# Push schema changes to the running DB container
pnpm --filter api db:push
```

---

### ⚠️ IMPORTANT: Production & Data Persistence

- **Development**: Data is stored in the Docker Volume `postgres_data`. If you delete the volume (`docker-compose down -v`), data is lost.
- **Production**: Use a Managed Database (AWS RDS, Supabase, etc).

---

## Alternative: Run Without Docker

If you find Docker heavy or hectic, you can run everything natively on your Mac.

### 1. Install Prerequisites (Mac)

```bash
# Install PostgreSQL and Redis via Homebrew
brew install postgresql redis

# Start services (run in background)
brew services start postgresql
brew services start redis
```

### 2. Configure Local Database

Run our setup script to create the expected user and database in your local Postgres:

```bash
./scripts/setup-local-db.sh
```

### 3. Verify `.env` matches

Ensure your `apps/api/.env` uses `localhost` (this is the default):

```bash
DATABASE_URL="postgresql://examdex:examdex_dev_password@localhost:5432/examdex?schema=public"
# If you don't use Redis yet, you can ignore it or set:
REDIS_URL="redis://localhost:6379"
```

### 4. Start App

```bash
pnpm --filter api db:push  # Sync schema
pnpm dev                   # Start app
```

## Development

### Start all apps

```bash
pnpm dev
```

### Start specific app

```bash
# Web app only
pnpm --filter web dev

# API only
pnpm --filter api dev
```

## Build

### Build all

```bash
pnpm build
```

### Build specific app

```bash
pnpm --filter web build
pnpm --filter api build
```

## Other Commands

### Linting

```bash
pnpm lint
```

### Type checking

```bash
pnpm typecheck
```

### Format code

```bash
pnpm format
```

## Project Structure

```
examdex/
├── apps/
│   ├── api/          # Backend API
│   └── web/          # Frontend web app
├── packages/
│   └── shared/       # Shared code/utilities
└── turbo.json        # Turborepo config
```

## Turborepo Commands

Run commands across all workspaces:

```bash
pnpm turbo run <task>
```

Run with filtering:

```bash
pnpm turbo run build --filter=web
pnpm turbo run dev --filter=api
```

Or use the root package.json scripts (recommended):

```bash
pnpm dev
pnpm build
```
