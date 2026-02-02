# ExamDex

> Enterprise-grade exam management platform built with modern web technologies

[![CI](https://github.com/yourusername/examdex/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/examdex/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 🚀 Features

- **Monorepo Architecture** - Turborepo-powered workspace for scalable development
- **Type-Safe** - Full TypeScript coverage across frontend and backend
- **Modern Stack** - React, Vite, Express, and Node.js
- **Production Ready** - Docker, CI/CD, health checks, and monitoring
- **Developer Experience** - Hot reload, linting, formatting, and type checking

## 📦 Project Structure

```
examdex/
├── apps/
│   ├── api/              # Express.js backend API
│   └── web/              # React + Vite frontend
├── packages/
│   └── shared/           # Shared utilities and types
├── .github/
│   └── workflows/        # CI/CD pipelines
├── docker-compose.yml    # Local development services
└── turbo.json           # Turborepo configuration
```

## 🛠️ Tech Stack

### Frontend

- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **Type Safety:** TypeScript

### Backend

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Language:** TypeScript
- **Validation:** Zod
- **CORS:** Enabled

### DevOps

- **Monorepo:** Turborepo
- **Package Manager:** pnpm
- **CI/CD:** GitHub Actions
- **Containerization:** Docker
- **Code Quality:** ESLint, Prettier

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- pnpm 9.0.0+ ([Install](https://pnpm.io/installation))
- Docker (optional, for containerized services)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/examdex.git
cd examdex

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# Start development servers
pnpm dev
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

### Using Docker Compose

```bash
# Start all services (PostgreSQL, Redis, API)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📝 Available Scripts

### Root Level

```bash
pnpm dev          # Start all apps in development mode
pnpm build        # Build all apps for production
pnpm lint         # Lint all packages
pnpm typecheck    # Type check all packages
pnpm format       # Format code with Prettier
pnpm test         # Run all tests
```

### Workspace-Specific

```bash
# Run commands for specific workspace
pnpm --filter web dev
pnpm --filter api build
pnpm --filter @repo/shared typecheck
```

## 🏗️ Development

### Code Quality

This project enforces code quality through:

- **ESLint** - Linting and code standards
- **Prettier** - Code formatting
- **TypeScript** - Type safety
- **Husky** - Git hooks (optional)

```bash
# Lint code
pnpm lint

# Format code
pnpm format

# Type check
pnpm typecheck
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

## 🚀 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Configure:
   - **Root Directory:** `apps/web`
   - **Build Command:** `cd ../.. && pnpm install && pnpm --filter web build`
   - **Output Directory:** `dist`

### Backend (Railway/Render)

1. Connect GitHub repository
2. Select `apps/api` as root directory
3. Platform auto-detects Dockerfile
4. Add environment variables
5. Deploy

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## 📚 Documentation

- [Setup Guide](docs/SETUP.md) - Detailed setup instructions
- [Database Guide](DATABASE.md) - Database migrations & Prisma commands
- [Deployment Guide](DEPLOYMENT.md) - Production deployment
- [Contributing](CONTRIBUTING.md) - Contribution guidelines
- [Code of Conduct](CODE_OF_CONDUCT.md) - Community standards

## 🗄️ Database Quick Reference

```bash
# For new developers - apply all migrations
cd apps/api
npx prisma migrate dev

# After pulling new code with migrations
cd apps/api
npx prisma migrate dev

# View database in GUI
npx prisma studio

# Check migration status
npx prisma migrate status
```

See [DATABASE.md](DATABASE.md) for complete migration guide.

## 🔐 Environment Variables

### Backend (`apps/api/.env`)

```env
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/examdex
JWT_SECRET=your-secret-key
ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend (`apps/web/.env`)

```env
VITE_API_URL=http://localhost:3001
VITE_APP_NAME=ExamDex
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Your Name** - _Initial work_ - [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- [Turborepo](https://turbo.build/) - Monorepo tooling
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Vite](https://vitejs.dev/) - Build tool

## 📞 Support

For support, email support@examdex.com or join our Slack channel.

---

Made with ❤️ by the ExamDex Team
