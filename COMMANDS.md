# Project Commands

## Build & Production

pnpm build
pnpm start

## Testing & Quality

pnpm test
pnpm lint

## Infrastructure (Docker)

docker-compose up -d
docker-compose stop
docker-compose down

## Development & Setup

pnpm install

pnpm add <package-name> --filter <app-or-package-name>

npx shadcn@latest add <component-name>

pnpm dev

---

pnpm --filter api db:push

pnpm --filter api db:generate

pnpm --filter api db:studio

# Clean artifacts

pnpm clean

# Deep clean node_modules (if things get weird)

find . -name "node_modules" -type d -prune -exec rm -rf '{}' +
pnpm install

```

```
