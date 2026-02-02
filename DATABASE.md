# Database Migration Guide

Quick reference for working with Prisma migrations in the ExamDex project.

## 🚀 Quick Start for New Developers

After cloning the repository and setting up your environment:

```bash
# 1. Install dependencies
pnpm install

# 2. Setup database (choose one option below)

# Option A: Using Docker
docker-compose up -d

# Option B: Using native PostgreSQL
bash scripts/setup-local-db.sh

# 3. Apply all migrations
cd apps/api
npx prisma migrate dev

# 4. Start development
cd ../..
pnpm dev
```

---

## 📥 Pulling New Migrations

When you pull code that includes new database migrations:

```bash
# 1. Pull latest code
git pull origin main

# 2. Install any new dependencies
pnpm install

# 3. Apply new migrations
cd apps/api
npx prisma migrate dev

# 4. Verify everything is in sync
npx prisma migrate status
```

**Expected output:**

```
Database schema is up to date!
```

---

## 🔨 Creating New Migrations

When you modify the Prisma schema (`apps/api/prisma/schema.prisma`):

```bash
cd apps/api

# 1. Create and apply migration
npx prisma migrate dev --name descriptive_migration_name

# Examples:
npx prisma migrate dev --name add_user_avatar
npx prisma migrate dev --name create_notifications_table
npx prisma migrate dev --name add_exam_duration_field
```

**What happens:**

1. Prisma analyzes schema changes
2. Generates SQL migration file in `prisma/migrations/`
3. Applies migration to your local database
4. Regenerates Prisma Client with new types

---

## 📋 Common Commands

### Check Migration Status

```bash
cd apps/api
npx prisma migrate status
```

### Generate Prisma Client (after schema changes)

```bash
cd apps/api
npx prisma generate
```

### Open Prisma Studio (Database GUI)

```bash
cd apps/api
npx prisma studio
```

Opens at `http://localhost:5555`

### Reset Database (⚠️ Deletes all data)

```bash
cd apps/api
npx prisma migrate reset
```

### Format Schema File

```bash
cd apps/api
npx prisma format
```

---

## 🐛 Common Issues & Solutions

### Issue: "Permission denied to create database"

**Cause:** Database user lacks `CREATEDB` privilege needed for Prisma's shadow database.

**Solution:**

```bash
# Re-run setup script
bash scripts/setup-local-db.sh

# Or manually grant permission
psql -d postgres -c "ALTER USER examdex CREATEDB;"
```

---

### Issue: "Database schema is not in sync with migration history"

**Cause:** Local database state doesn't match migration files.

**Solution:**

```bash
cd apps/api

# Option 1: Reset and reapply (⚠️ loses data)
npx prisma migrate reset

# Option 2: Mark as applied without running
npx prisma migrate resolve --applied "migration_name"
```

---

### Issue: "Shadow database already exists"

**Cause:** Previous migration failed to clean up shadow database.

**Solution:**

```bash
# Drop shadow database manually
psql -d postgres -c "DROP DATABASE IF EXISTS examdex_shadow;"

# Retry migration
cd apps/api
npx prisma migrate dev
```

---

### Issue: Migration fails during development

**Solution:**

```bash
cd apps/api

# 1. Mark the failed migration as rolled back
npx prisma migrate resolve --rolled-back "migration_name"

# 2. Fix your schema.prisma

# 3. Create a new migration
npx prisma migrate dev --name fix_previous_migration
```

---

## 🔄 Migration Workflow

### For Feature Development

```bash
# 1. Create feature branch
git checkout -b feature/add-notifications

# 2. Modify schema
# Edit apps/api/prisma/schema.prisma

# 3. Create migration
cd apps/api
npx prisma migrate dev --name add_notifications

# 4. Test your changes
cd ../..
pnpm dev

# 5. Commit migration files
git add apps/api/prisma/migrations/
git add apps/api/prisma/schema.prisma
git commit -m "feat: add notifications system"

# 6. Push to remote
git push origin feature/add-notifications
```

---

## 📊 Database Schema

The database contains **27 tables** across 6 domains:

### RBAC System

- `roles` - User roles (Admin, Student, etc.)
- `permissions` - Available permissions
- `role_permissions` - Role-permission mappings

### Auth & Identity

- `users` - Core user accounts
- `otp_requests` - OTP verification for students
- `admin_team_invites` - Team member invitations

### Student Profiles

- `students` - Student-specific data
- `student_profiles` - Extended student information

### Exam & Curriculum

- `exams` - Available exams
- `subjects` - Subject catalog
- `topics` - Topic hierarchy
- `exam_subjects` - Exam-subject relationships

### Knowledge Base & AI

- `knowledge_sources` - Uploaded learning materials
- `knowledge_index_jobs` - Vector DB indexing jobs
- `ai_models` - AI model configurations
- `prompt_templates` - Question generation templates
- `ai_usage_logs` - AI usage tracking

### Questions & Tests

- `questions` - Question bank (with JSONB options)
- `tests` - Generated tests
- `test_questions` - Test-question relationships
- `student_answers` - Student responses with timing

### Analytics & Economy

- `test_results` - Test performance metrics
- `rankings` - Leaderboard data
- `credit_wallets` - Student credit balances
- `credit_transactions` - Credit history
- `packages` - Available credit packages
- `purchases` - Purchase history
- `audit_logs` - System audit trail

**Full schema:** `apps/api/prisma/schema.prisma`

---

## 🚨 Production Considerations

### DO NOT in Production:

- ❌ `npx prisma migrate reset` - Deletes all data
- ❌ `npx prisma db push` - Bypasses migration history
- ❌ Manual schema changes without migrations

### DO in Production:

- ✅ Use `npx prisma migrate deploy` (CI/CD)
- ✅ Test migrations in staging first
- ✅ Backup database before migrations
- ✅ Use managed database services (AWS RDS, Supabase, Neon)

### Production Migration Command:

```bash
# In CI/CD or production deployment
npx prisma migrate deploy
```

This applies pending migrations without prompts or development features.

---

## 📚 Additional Resources

- **Prisma Docs:** https://www.prisma.io/docs
- **Migration Guide:** https://www.prisma.io/docs/guides/migrate
- **Schema Reference:** https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference
- **Full Setup Guide:** [docs/SETUP.md](docs/SETUP.md)

---

## 💡 Tips

1. **Always commit migration files** - They're part of your source code
2. **Use descriptive migration names** - Future you will thank you
3. **Test migrations locally first** - Before pushing to shared branches
4. **Keep migrations small** - Easier to review and rollback
5. **Use Prisma Studio** - Great for inspecting data during development

---

**Need help?** Check [docs/SETUP.md](docs/SETUP.md) for detailed setup instructions or ask the team on Slack.
