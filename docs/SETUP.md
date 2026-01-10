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
