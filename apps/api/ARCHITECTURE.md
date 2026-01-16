# Feature-Based Architecture - API Layer Documentation

This document explains our flat feature-based architecture with separation of concerns.

```
src/
├── config/           # Environment configuration
│   ├── env.ts
│   └── index.ts
├── features/         # Feature modules (user, exam, etc.)
│   ├── user/
│   │   ├── user.entity.ts
│   │   ├── user.dto.ts
│   │   ├── user.repository.ts
│   │   ├── user.service.ts
│   │   ├── user.controller.ts
│   │   └── index.ts
│   ├── exam/
│   │   └── ... (same structure)
│   └── index.ts
├── lib/              # External service connections
│   ├── prisma.ts
│   └── index.ts
├── middleware/       # Express middleware
│   ├── error-handler.ts
│   ├── not-found.ts
│   ├── request-logger.ts
│   ├── validate-request.ts
│   └── index.ts
├── routes/           # Route definitions
│   └── index.ts
├── utils/            # Shared utilities
│   ├── app-error.ts
│   ├── async-handler.ts
│   ├── logger.ts
│   └── index.ts
├── container.ts      # Dependency injection
└── main.ts           # App bootstrap
```

---

## File Structure Per Feature

Each feature folder contains flat files with clear responsibilities:

| File              | Purpose                                                   |
| ----------------- | --------------------------------------------------------- |
| `*.entity.ts`     | Domain entity class + props interface                     |
| `*.dto.ts`        | Input/Output data transfer objects                        |
| `*.repository.ts` | Repository interface + implementations (Prisma, InMemory) |
| `*.service.ts`    | Business logic layer                                      |
| `*.controller.ts` | HTTP request/response handling                            |
| `index.ts`        | Barrel exports for the feature                            |

---

## 1. Entity (`*.entity.ts`)

**Purpose:** Core business object with properties, validation, and behavior.

```typescript
// user.entity.ts
export interface UserProps {
  id?: string;
  email: string;
  name?: string | null;
}

export class User {
  public readonly id: string;
  public readonly email: string;
  public readonly name: string | null;

  constructor(props: UserProps) {
    this.id = props.id ?? crypto.randomUUID();
    this.email = props.email;
    this.name = props.name ?? null;
  }
}
```

### Key Principles:

- **Encapsulates business rules** - Validation, default values, state transitions
- **Immutable or controlled mutation** - Properties are readonly or changed via methods
- **No external dependencies** - Pure TypeScript, no framework imports

---

## 2. DTOs (`*.dto.ts`)

**Purpose:** Define shapes for data entering and leaving the service layer.

```typescript
// user.dto.ts
export interface CreateUserInputDTO {
  email: string;
  name?: string;
}

export interface CreateUserOutputDTO {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
}
```

### Why DTOs?

- **Decouple internal structure from API** - Entity can differ from response shape
- **Validation boundary** - Define exactly what inputs are accepted
- **API versioning** - Change DTOs without touching entities

---

## 3. Repository (`*.repository.ts`)

**Purpose:** Data access layer - all database queries live here.

```typescript
// user.repository.ts
export interface IUserRepository {
  save(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
}

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(user: User): Promise<User> {
    const saved = await this.prisma.user.upsert({ ... });
    return new User(saved);
  }
  // ... other methods
}

export class InMemoryUserRepository implements IUserRepository {
  private users: Map<string, User> = new Map();

  async save(user: User): Promise<User> {
    this.users.set(user.id, user);
    return user;
  }
  // ... other methods
}
```

### Key Principles:

- **Interface defines the contract** - Services depend on `IUserRepository`, not concrete class
- **All DB queries here** - Complex joins, aggregations, raw SQL - all in repository
- **Multiple implementations** - `InMemoryRepository` for tests, `PrismaRepository` for production
- **Returns domain entities** - Maps database records to entity classes

---

## 4. Service (`*.service.ts`)

**Purpose:** Business logic orchestration - coordinates entities and repositories.

```typescript
// user.service.ts
export class UserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async createUser(input: CreateUserInputDTO): Promise<CreateUserOutputDTO> {
    // Business rule: check for existing user
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) throw new Error('User already exists');

    // Create entity
    const user = new User({ email: input.email, name: input.name });

    // Persist
    const saved = await this.userRepository.save(user);

    // Return DTO
    return { id: saved.id, email: saved.email, ... };
  }
}
```

### Key Principles:

- **Contains business logic** - Validation rules, orchestration, decisions
- **Depends on repository interface** - Not on Prisma or any specific DB
- **No HTTP knowledge** - Doesn't know about requests, responses, or status codes
- **Can use other services** - Inject `UserService` into `ExamService` if needed

### Service vs Repository:

| Need             | Use        |
| ---------------- | ---------- |
| Just data (CRUD) | Repository |
| Business logic   | Service    |

---

## 5. Controller (`*.controller.ts`)

**Purpose:** HTTP layer - translates requests to service calls and formats responses.

```typescript
// user.controller.ts
export class UserController {
  constructor(private readonly userService: UserService) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { email, name } = req.body;

      if (!email) {
        res.status(400).json({ error: "Email required" });
        return;
      }

      const user = await this.userService.createUser({ email, name });
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      if (error.message.includes("already exists")) {
        res.status(409).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
```

### Key Principles:

- **Thin controllers** - Extract data, call service, format response
- **HTTP-specific code** - Status codes, request parsing, response formatting
- **Error mapping** - Translate business errors to HTTP status codes
- **No business logic** - Don't make business decisions here

---

## 6. Dependency Injection (`container.ts`)

**Purpose:** Single place where all dependencies are wired together.

```typescript
// container.ts
import { UserService, UserController, InMemoryUserRepository } from "./features";

// Repositories
const userRepository = new InMemoryUserRepository();

// Services
const userService = new UserService(userRepository);

// Controllers
const userController = new UserController(userService);

export { userController };
```

### Why This Matters:

- **Swap implementations easily** - Change `InMemoryRepository` to `PrismaRepository` in one place
- **Test with mocks** - Inject mock repositories for unit tests
- **Clear dependency graph** - See how everything connects

---

## 7. Routes (`routes/index.ts`)

**Purpose:** Define all API endpoints in one place.

```typescript
// routes/index.ts
import { Router } from "express";
import { userController, examController } from "../container";

const router = Router();

// User routes
router.post("/users", (req, res) => userController.create(req, res));
router.get("/users", (req, res) => userController.getAll(req, res));
router.get("/users/:id", (req, res) => userController.getById(req, res));

// Exam routes
router.post("/exams", (req, res) => examController.create(req, res));

export { router };
```

---

## 8. App Bootstrap (`main.ts`)

**Purpose:** Minimal entry point - just starts the server.

```typescript
// main.ts
import express from "express";
import cors from "cors";
import { router } from "./routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(3001, () => console.log("Server running"));

export { app };
```

---

## Dependency Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    main.ts (Bootstrap)                       │
│  Sets up Express, middleware, mounts router                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    container.ts (DI)                         │
│  Wires: Repository → Service → Controller                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    routes/index.ts                           │
│  Maps HTTP endpoints to controller methods                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Controller                                │
│  Handles HTTP → calls Service → returns HTTP response        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Service                                   │
│  Business logic → uses Repository interface                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Repository                                │
│  Data access → returns Entity                                │
└─────────────────────────────────────────────────────────────┘
```

---

## Cross-Feature Dependencies

When one feature needs another:

```typescript
// exam.service.ts
export class ExamService {
  constructor(
    private readonly examRepository: IExamRepository,
    private readonly userRepository: IUserRepository  // For data lookup
    // OR
    private readonly userService: UserService  // For business logic
  ) {}
}
```

**Rule:** Use repository for simple data access, service for business logic.

---

## Production Folders

### Config (`config/`)

Centralized environment configuration with validation.

```typescript
// config/env.ts
export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "3001", 10),
  DATABASE_URL: process.env.DATABASE_URL || "",
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
};

export function validateEnv(): void {
  const required = ["DATABASE_URL"];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0 && env.isProduction) {
    throw new Error(`Missing: ${missing.join(", ")}`);
  }
}
```

### Lib (`lib/`)

External service connections (database, cache, etc.).

```typescript
// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export async function connectDatabase(): Promise<void> {
  await prisma.$connect();
}

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
}
```

### Middleware (`middleware/`)

Express middleware for cross-cutting concerns.

| File                  | Purpose                                        |
| --------------------- | ---------------------------------------------- |
| `error-handler.ts`    | Global error handling, formats error responses |
| `not-found.ts`        | 404 handler for unknown routes                 |
| `request-logger.ts`   | Logs incoming requests with timing             |
| `validate-request.ts` | Request body validation                        |

### Utils (`utils/`)

Shared utilities used across the application.

| File               | Purpose                                       |
| ------------------ | --------------------------------------------- |
| `app-error.ts`     | Custom error class with status codes          |
| `async-handler.ts` | Wraps async route handlers for error catching |
| `logger.ts`        | Structured logging utility                    |

---

## Main Entry Point (`main.ts`)

Production-ready bootstrap with:

- **Security**: Helmet, CORS configuration
- **Error handling**: Global error handler, uncaught exception handling
- **Graceful shutdown**: SIGTERM/SIGINT handlers, database disconnect
- **Request logging**: All requests logged with timing

```typescript
// main.ts
async function bootstrap(): Promise<void> {
  await connectDatabase();
  app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT}`);
  });
}

bootstrap();
```

---

## Benefits

1. **Colocation** - All user-related code in one folder
2. **Testability** - Swap repositories for mocks via container
3. **Scalability** - Add new features without touching existing ones
4. **Discoverability** - Easy to find code by feature name
5. **Flexibility** - Change database by swapping repository implementation
6. **Production-ready** - Error handling, logging, graceful shutdown

---

## Adding a New Feature

1. Create `features/[name]/` folder
2. Add files: `[name].entity.ts`, `[name].dto.ts`, `[name].repository.ts`, `[name].service.ts`, `[name].controller.ts`, `index.ts`
3. Export from `features/index.ts`
4. Wire in `container.ts`
5. Add routes with validation in `routes/index.ts`
