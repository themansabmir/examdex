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

This project uses **Prisma ORM** with **PostgreSQL** for database management. You can run the database either with Docker or natively on your machine.

---

## Option 1: Using Docker (Recommended)

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

### 3. Run Migrations

```bash
cd apps/api
npx prisma migrate dev
```

This will:

- Create a shadow database for validation
- Apply all pending migrations
- Generate Prisma Client

---

## Option 2: Native PostgreSQL (Without Docker)

If you prefer running PostgreSQL natively on your Mac:

### 1. Install Prerequisites

```bash
# Install PostgreSQL and Redis via Homebrew
brew install postgresql redis

# Start services (run in background)
brew services start postgresql
brew services start redis
```

### 2. Setup Database User & Permissions

Run our setup script to create the database user with proper permissions:

```bash
bash scripts/setup-local-db.sh
```

**What this script does:**

- Creates `examdex` user with password `examdex_dev_password`
- Grants `CREATEDB` privilege (required for Prisma shadow database)
- Creates `examdex` database
- Grants all privileges to the user

### 3. Verify Environment Variables

Ensure your `apps/api/.env` uses `localhost`:

````bash
DATABASE_URL="postgresql://examdex:examdex_dev_password@localhost:5432/examdex?schema=public"
REDIS_URL="redis://localhost:6379"
k```

### 4. Run Migrations

```bash
cd apps/api
npx prisma migrate dev
````

---

## 🔄 For New Developers (After Pulling Latest Code)

When you pull the latest code and there are new database migrations:

### 1. Pull Latest Code

```bash
git pull origin main
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Apply New Migrations

```bash
cd apps/api
npx prisma migrate dev
```

This command will:

- Detect new migration files in `prisma/migrations/`
- Apply them to your local database
- Regenerate Prisma Client with updated types

### 4. Verify Migration Status

```bash
npx prisma migrate status
```

---

## 🛠️ Common Prisma Commands

### Generate Prisma Client

After schema changes, regenerate the client:

```bash
cd apps/api
npx prisma generate
```

### View Database in Prisma Studio

```bash
cd apps/api
npx prisma studio
```

Opens a GUI at `http://localhost:5555` to browse and edit data.

### Reset Database (⚠️ Deletes All Data)

```bash
cd apps/api
npx prisma migrate reset
```

This will:

- Drop the database
- Recreate it
- Apply all migrations from scratch
- Run seed scripts (if configured)

### Create a New Migration

After modifying `schema.prisma`:

```bash
cd apps/api
npx prisma migrate dev --name your_migration_name
```

---

## 🐛 Troubleshooting

### Error: "Permission denied to create database"

**Solution:** The database user needs `CREATEDB` privilege for Prisma's shadow database.

```bash
# Re-run the setup script to grant permissions
bash scripts/setup-local-db.sh
```

Or manually grant the privilege:

```bash
psql -d postgres -c "ALTER USER examdex CREATEDB;"
```

### Error: "Database schema is not in sync"

**Solution:** Reset and reapply migrations:

```bash
cd apps/api
npx prisma migrate reset
npx prisma migrate dev
```

### Error: "Shadow database already exists"

**Solution:** Prisma couldn't clean up the shadow database. Drop it manually:

```bash
psql -d postgres -c "DROP DATABASE IF EXISTS examdex_shadow;"
```

Then retry the migration:

```bash
npx prisma migrate dev
```

---

## 📊 Database Schema Overview

The database includes 27 tables organized into:

- **RBAC System**: `roles`, `permissions`, `role_permissions`
- **Auth & Identity**: `users`, `otp_requests`, `admin_team_invites`
- **Student Profiles**: `students`, `student_profiles`
- **Exam & Curriculum**: `exams`, `subjects`, `topics`, `exam_subjects`
- **Knowledge Base**: `knowledge_sources`, `knowledge_index_jobs`, `ai_models`, `prompt_templates`, `ai_usage_logs`
- **Questions & Tests**: `questions`, `tests`, `test_questions`, `student_answers`
- **Analytics & Economy**: `test_results`, `rankings`, `credit_wallets`, `credit_transactions`, `packages`, `purchases`, `audit_logs`

View the complete schema: `apps/api/prisma/schema.prisma`

---

## ⚠️ IMPORTANT: Production & Data Persistence

- **Development**:
  - Docker: Data stored in `postgres_data` volume. Use `docker-compose down -v` to delete.
  - Native: Data stored in PostgreSQL data directory.
- **Production**: Use a managed database service (AWS RDS, Supabase, Neon, etc).
- **Never run `prisma migrate reset` in production** - it will delete all data!

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
