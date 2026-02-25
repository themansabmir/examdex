# ---------- base ----------
FROM node:20-alpine AS base
RUN npm install -g pnpm


# ---------- builder ----------
FROM base AS builder
WORKDIR /app

# copy workspace metadata first (max cache reuse)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.json ./

# copy api manifest
COPY apps/api/package.json ./apps/api/package.json

# install ONLY api + its workspace deps
RUN pnpm install --filter api... --frozen-lockfile --ignore-scripts

# copy source
COPY apps/api ./apps/api

# generate Prisma client first
RUN pnpm --filter api db:generate

# optimize for free plan resources and disable git hooks
ENV NODE_OPTIONS=--max-old-space-size=1536
ENV HUSKY=0

# build api (turbo will delegate to tsc; root tsconfig.json is present)
RUN TURBO_TELEMETRY_DISABLED=1 pnpm --filter api run build


# ---------- runner ----------
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# copy built artifacts and pre-installed node_modules from builder
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health',(r)=>{process.exit(r.statusCode===200?0:1)})"

USER node
CMD ["node","dist/index.js"]