# Deployment Guide

## Frontend (Vercel)

**No Dockerfile needed** - Vercel handles everything automatically.

### Steps:
1. Push code to GitHub/GitLab/Bitbucket
2. Import project in Vercel dashboard
3. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `apps/web`
   - **Build Command:** `cd ../.. && pnpm install && pnpm --filter web build`
   - **Output Directory:** `dist`
   - **Install Command:** `pnpm install`

### Environment Variables (if needed):
Add in Vercel dashboard under Settings → Environment Variables

---

## Backend (Railway/Render/Fly.io/etc.)

**Dockerfile required** - Create one for containerized deployment.

### Create Dockerfile

Create `apps/api/Dockerfile`:

```dockerfile
FROM node:18-alpine AS base
RUN npm install -g pnpm

# Build stage
FROM base AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/
RUN pnpm install --frozen-lockfile

COPY apps/api ./apps/api
COPY packages/shared ./packages/shared
COPY turbo.json ./
RUN pnpm --filter api build

# Production stage
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["node", "dist/index.js"]
```

### Create .dockerignore

Create `apps/api/.dockerignore`:

```
node_modules
dist
.turbo
*.log
.env
.env.local
```

### Deployment Options

#### Railway
1. Connect GitHub repo
2. Select `apps/api` as root directory
3. Railway auto-detects Dockerfile
4. Add environment variables
5. Deploy

#### Render
1. New Web Service → Connect repo
2. **Root Directory:** `apps/api`
3. **Docker Command:** Uses Dockerfile automatically
4. Add environment variables
5. Deploy

#### Fly.io
```bash
cd apps/api
fly launch
fly deploy
```

---

## Alternative: Backend on Vercel (Serverless)

If you want both on Vercel, convert Express to serverless:

Create `apps/api/vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/index.js"
    }
  ]
}
```

**Note:** Serverless has limitations (cold starts, execution time limits).

---

## Environment Variables

### Backend (.env)
```
PORT=3000
NODE_ENV=production
DATABASE_URL=your_database_url
API_KEY=your_api_key
```

### Frontend (.env)
```
VITE_API_URL=https://your-api-url.com
```

---

## Quick Reference

| Service | Frontend | Backend | Dockerfile |
|---------|----------|---------|------------|
| Vercel | ✅ Best | ⚠️ Serverless only | ❌ No |
| Railway | ❌ No | ✅ Best | ✅ Yes |
| Render | ✅ Yes | ✅ Yes | ✅ Yes |
| Fly.io | ❌ No | ✅ Best | ✅ Yes |

**Recommended:**
- Frontend: Vercel
- Backend: Railway or Render (with Docker)
