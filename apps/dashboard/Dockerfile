# ---------- base ----------
FROM node:20-alpine AS base
RUN npm install -g pnpm


# ---------- builder ----------
FROM base AS builder
WORKDIR /app

# copy workspace metadata first (max cache reuse)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# copy dashboard manifest
COPY apps/dashboard/package.json ./apps/dashboard/package.json

# install ONLY dashboard + its workspace deps
RUN pnpm install --filter dashboard... --frozen-lockfile --ignore-scripts

# copy source
COPY apps/dashboard ./apps/dashboard

# optimize for free plan resources and disable git hooks
ENV NODE_OPTIONS=--max-old-space-size=1536
ENV HUSKY=0

# build dashboard
RUN TURBO_TELEMETRY_DISABLED=1 pnpm --filter dashboard run build

# ---------- runner ----------
FROM nginx:alpine AS runner

# copy built files to nginx
COPY --from=builder /app/apps/dashboard/dist /usr/share/nginx/html

# copy nginx configuration
COPY apps/dashboard/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
