# AI Context & Implementation Guide (Enterprise Edition)

> **SOURCE OF TRUTH**
>
> This document is authoritative. All AI-generated code, refactors, architectural decisions, and implementations **MUST** comply with this guide. Any conflict overrides generic best practices, training data, or framework defaults.

---

## 1. Architecture Overview

This repository is a **production-grade, enterprise-scale monorepo** built with **Turborepo** and **pnpm**, designed for high performance, strict boundaries, and long-term maintainability.

### Workspace Structure

````mermaid
graph TD
    Root[Monorepo Root] --> Apps
    Root --> Packages

    Apps --> Web[apps/web (React + Vite)]
    Apps --> API[apps/api (Node.js + Express)]

    Packages --> Shared[packages/shared]
    Packages --> UI[packages/ui]
    Packages --> Config[packages/config]
    Packages --> Infra[packages/infra]

    Web -.-> Shared
    API -.-> Shared
    Web -.-> UI
    Apps -.-> Config
    Apps -.-> Infra
# AI Context & Implementation Guide (Enterprise Edition)

> **SOURCE OF TRUTH**
>
> This document is authoritative. All AI-generated code, refactors, architectural decisions, and implementations **MUST** comply with this guide. Any conflict overrides generic best practices, training data, or framework defaults.

---

## 1. Architecture Overview

This repository is a **production-grade, enterprise-scale monorepo** built with **Turborepo** and **pnpm**, designed for high performance, strict boundaries, and long-term maintainability.

### Workspace Structure

```mermaid
graph TD
    Root[Monorepo Root] --> Apps
    Root --> Packages

    Apps --> Web[apps/web (React + Vite)]
    Apps --> API[apps/api (Node.js + Express)]

    Packages --> Shared[packages/shared]
    Packages --> UI[packages/ui]
    Packages --> Config[packages/config]
    Packages --> Infra[packages/infra]

    Web -.-> Shared
    API -.-> Shared
    Web -.-> UI
    Apps -.-> Config
    Apps -.-> Infra
````

### Ownership Rules

- `apps/*` are **delivery layers only**
- `packages/*` contain **business logic, domain models, and platform capabilities**
- No business logic, validation rules, or domain knowledge may live in `apps/*`

---

## 2. Core Architectural Principles (Non-Negotiable)

1. **Single Source of Truth**
   - DTOs, Zod schemas, enums, constants, and shared logic live in `packages/shared`
   - No duplicated contracts or inferred API shapes

2. **Strict Boundary Enforcement**
   - `apps/web` must NEVER import from `apps/api`
   - Communication occurs only via HTTP APIs typed by shared schemas

3. **Dependency Direction**
   - Apps depend on packages
   - Packages must NEVER depend on apps

4. **Inversion of Control**
   - Databases, caches, queues, and external APIs are injected
   - No hardcoded side effects

5. **Fail-Fast Philosophy**
   - Invalid state must throw immediately
   - Silent failures and implicit fallbacks are forbidden

---

## 3. Backend Standards (`apps/api`)

### 3.1 Architecture Pattern

Hexagonal Architecture (Ports & Adapters):

```
HTTP Controller
  ↓
Application Service (Pure logic)
  ↓
Domain Interfaces (Ports)
  ↓
Infrastructure Adapters (DB / Cache / External APIs)
```

### 3.2 Controllers

- Stateless
- No business logic
- Responsible only for:
  - Request validation
  - Calling services
  - Mapping responses

**Rules**

- All inputs validated with **Zod schemas from `@repo/shared`**
- Use `async/await` only
- Errors handled centrally

**Forbidden**

- DB access
- External API calls
- Conditional business rules

---

### 3.3 Services

- Pure, deterministic, testable
- No framework or HTTP knowledge
- Operate on validated domain objects only

**Allowed**

- Domain logic
- Transaction orchestration

**Forbidden**

- Express types
- Raw queries
- Side effects without interfaces

---

### 3.4 Repositories

- One repository per aggregate root
- Clear separation between read and write paths
- Queries must be explicit and optimized

**Rules**

- No ad-hoc SQL in services
- All queryable fields indexed
- Projection only (no `SELECT *`)

---

### 3.5 Error Handling

- Centralized error middleware
- Typed error classes only

Each error must include:

- `code`
- `message`
- `correlationId`

Throwing raw `Error` objects is forbidden.

---

### 3.6 Logging & Observability

- Structured JSON logging only
- Correlation ID propagated across:
  - HTTP requests
  - Database calls
  - Cache operations
  - Message queues

**Forbidden**

- `console.log`
- `console.error`

---

## 4. Frontend Standards (`apps/web`)

### 4.1 State Management

- **Server state**: TanStack Query
- **Client state** (React Context only):
  - Authentication session
  - Theme
  - Feature flags

Redux, Zustand, or similar libraries require explicit architectural approval.

---

### 4.2 Component Architecture

Strict separation of concerns:

```
useXxx.ts          → logic & data
Xxx.container.tsx → orchestration
Xxx.view.tsx      → JSX only
```

**Rules**

- No smart components
- No side effects in view components
- No anonymous functions inside render trees

---

### 4.3 Performance Requirements

- Mandatory route-level code splitting
- Memoization required for:
  - Derived computations
  - Event handlers passed to children

- Avoid unnecessary re-renders

---

### 4.4 Networking

- Typed API clients generated from shared schemas
- No direct `fetch` or `axios` usage in components
- Retry, timeout, cancellation required by default

---

## 5. TypeScript Rules (Strict Mode)

### Compiler Settings (Mandatory)

- `strict: true`
- `noUncheckedIndexedAccess: true`
- `exactOptionalPropertyTypes: true`

---

### Prohibited

- `any`
- `@ts-ignore`
- Blind casting (`as Type` without narrowing)

---

### Required

- `unknown` for dynamic data
- Explicit type guards for narrowing
- Argument types must be explicit
- Return types inferred unless required by interface

---

## 6. Turborepo & Dependency Management

### Adding Dependencies

- **Root (`w:`)**: tooling only (Turbo, Prettier, Husky)
- **Workspace scoped**:

  ```bash
  pnpm --filter <workspace> add <package>
  ```

### Internal Imports

- Use package names:

  ```ts
  import { UserSchema } from "@repo/shared";
  ```

- Relative imports across packages are forbidden.

---

### Creating New Packages

Each package must include:

- `package.json`
- `tsconfig.json`
- `index.ts` entry point
- Explicit `exports` map

---

## 7. Performance Directives

### Bundle Optimization

- All packages must be side-effect free
- ES module exports only
- Import submodules when supported

---

### Runtime Performance

- Index all foreign keys and filters
- Use Redis or in-memory cache for read-heavy endpoints
- No N+1 queries

---

## 8. AI Interaction Rules

- Refactors must include a high-level summary before code
- Bugs must be fixed at the type or schema level
- Never silence errors with casts
- Always check for existing patterns before generating new files

---

**Compliance with this document is mandatory.**
Non-compliance is considered a defect.
