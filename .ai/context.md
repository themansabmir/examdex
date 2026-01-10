# ExamDex Codebase Context

## 🎯 Project Overview

**ExamDex** is an enterprise-grade exam management platform built as a monorepo using Turborepo. It consists of a React frontend and Express.js backend with shared utilities.

## 🏗️ Architecture

### High-Level Structure

```
┌─────────────────┐
│   Frontend      │
│  (React+Vite)   │
│   Port: 5173    │
└────────┬────────┘
         │ HTTP/REST
         ▼
┌─────────────────┐
│   Backend API   │
│  (Express.js)   │
│   Port: 3001    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Database      │
│  (PostgreSQL)   │
└─────────────────┘
```

## 📦 Workspaces

### 1. `apps/api` - Backend API

**Purpose:** RESTful API server handling business logic and data operations

**Tech Stack:**
- Node.js 18+
- Express.js
- TypeScript
- Zod (validation)
- CORS enabled

**Key Files:**
- `src/index.ts` - Entry point, Express app setup
- `package.json` - Dependencies and scripts
- `Dockerfile` - Production container configuration
- `tsconfig.json` - TypeScript configuration

**Scripts:**
- `pnpm dev` - Development with hot reload (tsx watch)
- `pnpm build` - Compile TypeScript to `dist/`
- `pnpm start` - Run production build
- `pnpm lint` - ESLint checking
- `pnpm typecheck` - TypeScript type checking

**Port:** 3001 (configurable via `PORT` env var)

### 2. `apps/web` - Frontend Application

**Purpose:** User-facing React application

**Tech Stack:**
- React 18
- Vite (build tool)
- TypeScript
- TailwindCSS
- shadcn/ui components
- Lucide React icons

**Key Files:**
- `src/main.tsx` - React entry point
- `src/App.tsx` - Root component
- `index.html` - HTML template
- `vite.config.ts` - Vite configuration
- `tailwind.config.js` - Tailwind configuration

**Scripts:**
- `pnpm dev` - Development server with HMR
- `pnpm build` - Production build to `dist/`
- `pnpm preview` - Preview production build
- `pnpm lint` - ESLint checking
- `pnpm typecheck` - TypeScript type checking

**Port:** 5173 (Vite default, auto-increments if busy)

### 3. `packages/shared` - Shared Code

**Purpose:** Shared utilities, types, and constants used by both frontend and backend

**Contents:**
- Type definitions
- Validation schemas
- Utility functions
- Constants

**Usage:**
```typescript
import { SomeType } from '@repo/shared';
```

## 🔄 Data Flow

1. **User Interaction** → Frontend (React)
2. **API Request** → Backend (Express)
3. **Data Processing** → Business Logic
4. **Database Query** → PostgreSQL
5. **Response** → Frontend
6. **UI Update** → React State

## 🗂️ File Organization

### Backend (`apps/api/src/`)
```
src/
├── index.ts          # App entry point
├── routes/           # API route handlers
├── controllers/      # Business logic
├── models/           # Data models
├── middleware/       # Express middleware
├── utils/            # Helper functions
└── types/            # TypeScript types
```

### Frontend (`apps/web/src/`)
```
src/
├── main.tsx          # React entry point
├── App.tsx           # Root component
├── components/       # React components
│   └── ui/          # shadcn/ui components
├── pages/            # Page components
├── hooks/            # Custom React hooks
├── lib/              # Utilities
├── styles/           # Global styles
└── types/            # TypeScript types
```

## 🔌 API Endpoints

### Current Endpoints
- `GET /health` - Health check endpoint (expected by Docker)
- Add more endpoints as they're implemented

### API Conventions
- RESTful design
- JSON request/response
- Proper HTTP status codes
- Error handling with consistent format
- Input validation with Zod

## 🎨 UI Components

### Component Library
- **shadcn/ui** - Pre-built accessible components
- **Lucide React** - Icon library
- **TailwindCSS** - Utility-first styling

### Component Patterns
- Functional components with hooks
- TypeScript prop types
- Composition over inheritance
- Atomic design principles

## 🔐 Environment Variables

### Backend (`apps/api/.env`)
```env
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://...
JWT_SECRET=...
ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend (`apps/web/.env`)
```env
VITE_API_URL=http://localhost:3001
VITE_APP_NAME=ExamDex
```

## 🚀 Development Workflow

### Starting Development
```bash
# Root directory
pnpm install          # Install all dependencies
pnpm dev              # Start all apps

# Or individually
pnpm --filter api dev
pnpm --filter web dev
```

### Building for Production
```bash
pnpm build            # Build all apps
pnpm --filter api build
pnpm --filter web build
```

## 🧪 Testing Strategy

### Unit Tests
- Test individual functions and components
- Mock external dependencies
- Fast execution

### Integration Tests
- Test API endpoints
- Test component interactions
- Use test database

### E2E Tests
- Test complete user flows
- Use real browser environment

## 📊 State Management

### Frontend State
- React hooks (useState, useEffect)
- Context API for global state
- Consider adding React Query for server state

### Backend State
- Stateless API design
- Session management (if needed)
- Database as source of truth

## 🔍 Debugging

### Frontend
- React DevTools
- Browser console
- Vite error overlay

### Backend
- Console logs (use proper logging library in production)
- Node.js debugger
- API testing tools (Postman, Thunder Client)

## 📈 Performance Considerations

### Frontend
- Code splitting with React.lazy
- Image optimization
- Bundle size monitoring
- Lazy loading components

### Backend
- Database query optimization
- Caching strategies (Redis)
- Connection pooling
- Rate limiting

## 🔒 Security

### Frontend
- XSS prevention (React escapes by default)
- HTTPS in production
- Secure cookie handling
- Input sanitization

### Backend
- CORS configuration
- Input validation (Zod)
- SQL injection prevention (use ORM/parameterized queries)
- Authentication & authorization
- Rate limiting
- Helmet.js for security headers

## 🚢 Deployment

### Frontend (Vercel)
- Automatic builds from Git
- Environment variables in dashboard
- Preview deployments for PRs

### Backend (Railway/Render/Fly.io)
- Docker-based deployment
- Environment variables in platform
- Health checks enabled
- Auto-scaling

## 🔄 CI/CD Pipeline

### On Pull Request
1. Install dependencies
2. Lint all code
3. Type check
4. Run tests
5. Build all apps

### On Merge to Main
1. Run full CI pipeline
2. Deploy frontend to Vercel
3. Build and push Docker image
4. Deploy backend to hosting platform

## 📝 Code Quality

### Automated Checks
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking
- **Husky** - Pre-commit hooks
- **lint-staged** - Staged file linting

### Standards
- No `any` types
- Proper error handling
- Consistent naming conventions
- Comprehensive JSDoc comments
- Test coverage >80%

## 🎯 Project Goals

1. **Scalability** - Handle growing user base
2. **Maintainability** - Clean, documented code
3. **Performance** - Fast load times and responses
4. **Security** - Protect user data
5. **Developer Experience** - Easy to contribute
6. **User Experience** - Intuitive interface

## 🔮 Future Enhancements

- Real-time features (WebSockets)
- Advanced caching (Redis)
- Microservices architecture
- GraphQL API
- Mobile app (React Native)
- Analytics dashboard
- Admin panel
