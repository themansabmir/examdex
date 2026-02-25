# ---------- base ----------
FROM node:20-alpine AS base
RUN npm install -g pnpm


# ---------- builder ----------
FROM base AS builder
WORKDIR /app

# copy workspace metadata first (max cache reuse)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# copy api manifest
COPY apps/api/package.json ./apps/api/package.json

# install ONLY api + its workspace deps
RUN pnpm install --filter api... --frozen-lockfile --ignore-scripts

# copy source
COPY apps/api ./apps/api

# prevent TypeScript OOM in CI and disable git hooks
ENV NODE_OPTIONS=--max-old-space-size=4096
ENV HUSKY=0

# build api
RUN pnpm --filter api build


# ---------- runner ----------
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# runtime artifacts
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/pnpm-workspace.yaml ./

# install only production deps for api
RUN pnpm install --prod --filter api... --frozen-lockfile --ignore-scripts

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health',(r)=>{process.exit(r.statusCode===200?0:1)})"

USER node
CMD ["node","dist/index.js"]