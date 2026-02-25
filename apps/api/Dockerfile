FROM node:20-alpine AS base
RUN npm install -g pnpm

# Build stage
FROM base AS builder
WORKDIR /app

# Copy workspace configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY turbo.json ./

# Copy package.json files for all workspaces
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/api ./apps/api
COPY packages/shared ./packages/shared

# Build the API and shared packages
RUN pnpm --filter api build

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy built files and necessary dependencies
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./package.json

# Copy shared package if needed at runtime
COPY --from=builder /app/packages/shared ./packages/shared

# Install only production dependencies
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/pnpm-workspace.yaml ./
RUN pnpm install --prod --frozen-lockfile

# Expose port (adjust if your API uses a different port)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Run as non-root user for security
USER node

CMD ["node", "dist/index.js"]
