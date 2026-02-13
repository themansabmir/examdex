# ExamDex Dashboard - Codebase Architecture & Best Practices

## Overview

This document outlines the architecture, folder structure, and best practices for the ExamDex Dashboard application. This serves as a comprehensive guide for future development and AI context understanding.

## Technology Stack

### Core Technologies

- **React 19.2.0** - Modern React with latest features
- **TypeScript 5.9.3** - Type safety and better DX
- **Vite 7.2.4** - Fast build tool and dev server
- **React Router DOM 7.13.0** - Client-side routing
- **Tailwind CSS 3.4.17** - Utility-first CSS framework

### UI & Design System

- **Radix UI** - Headless UI components for accessibility
- **shadcn/ui** - Component library built on Radix UI
- **Lucide React** - Icon library
- **Tailwind CSS Animate** - Animation utilities
- **Class Variance Authority (CVA)** - Component variant management

### State Management & Data

- **React Query (TanStack Query)** - Server state management
- **React Hook Form** - Form management with Zod validation
- **Zod** - Schema validation
- **Axios** - HTTP client

## Folder Structure

```
src/
├── app/                    # Application-level code
│   ├── layout/            # Layout components
│   ├── AuthContext.tsx    # Authentication context
│   ├── AppRouter.tsx      # Router configuration
│   ├── ProtectedRoute.tsx # Route protection
│   ├── providers.tsx      # Global providers
│   └── routes.config.ts   # Centralized route definitions
├── components/            # Reusable UI components
│   └── sidebar/          # Sidebar-specific components
├── features/             # Feature-based modules
│   ├── auth/             # Authentication feature
│   ├── users/            # User management feature
│   └── product/          # Product-related features
├── shared/               # Shared utilities and code
│   ├── ui/               # Reusable UI components
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utility functions
│   └── components/       # Shared components
└── assets/               # Static assets
```

## Architecture Patterns

### 1. Feature-Driven Development

Each feature follows a clean architecture pattern:

```
features/
├── auth/
│   ├── application/      # Business logic, use cases
│   ├── domain/          # Domain models, types
│   ├── infrastructure/  # External APIs, data sources
│   └── presentation/    # UI components, forms
```

**Benefits:**

- Clear separation of concerns
- Easy testing and maintenance
- Scalable feature organization

### 2. Layered Architecture

**app/** - Application Layer

- Routing and navigation
- Global state management
- Layout components
- Authentication context

**features/** - Business Logic Layer

- Feature-specific logic
- Domain models
- Use cases
- Feature components

**shared/** - Shared Layer

- Reusable components
- Utilities
- UI components
- Custom hooks

### 3. Component Composition

**Layout Components** (`app/layout/`)

- `DashboardLayout` - Main layout wrapper
- `Header` - Application header
- `MainContent` - Content area with page headers
- `Footer` - Application footer

**Feature Components** (`features/*/presentation/`)

- Business logic components
- Forms and data display
- Feature-specific UI

**Shared Components** (`shared/ui/`)

- Reusable UI primitives
- Design system components
- Cross-feature components

## Best Practices

### 1. File Organization

#### Naming Conventions

- **Components**: PascalCase (`UserList.tsx`, `LoginForm.tsx`)
- **Files**: kebab-case for folders, PascalCase for files
- **Constants**: UPPER_SNAKE_CASE (`ROUTES`, `API_ENDPOINTS`)
- **Types**: PascalCase (`AuthUser`, `LoginInput`)

#### Import Organization

```typescript
// External libraries first
import { useState } from "react";
import { Link } from "react-router-dom";

// Internal imports (absolute paths)
import { Button } from "@/shared/ui/button";
import { useAuth } from "@/app/AuthContext";
import { UserList } from "@/features/users/presentation/UserList";

// Relative imports (for feature-specific files)
import { LoginInput } from "../domain/Login";
```

### 2. Component Patterns

#### Component Structure

```typescript
// 1. Imports (external, then internal)
import type { ReactNode } from "react";
import { Button } from "@/shared/ui/button";

// 2. Props interface
interface ComponentProps {
  children: ReactNode;
  title: string;
}

// 3. Component implementation
export function Component({ children, title }: ComponentProps) {
  // 4. Hooks and state
  const [state, setState] = useState();

  // 5. Event handlers
  const handleClick = () => {
    // logic
  };

  // 6. JSX return
  return (
    <div>
      {/* content */}
    </div>
  );
}
```

#### Custom Hooks

```typescript
// Location: shared/hooks/ or feature/application/
export function useCustomHook() {
  // Hook logic
  return {
    // Return object for better destructuring
    value,
    actions: {
      update,
      reset,
    },
  };
}
```

### 3. State Management

#### Authentication State

```typescript
// AuthContext.tsx - Global auth state
interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
}
```

#### Server State

```typescript
// Use React Query for server state
const { data, isLoading, error } = useQuery({
  queryKey: ["users"],
  queryFn: () => userApi.getUsers(),
});
```

#### Form State

```typescript
// Use React Hook Form with Zod validation
const form = useForm<LoginInput>({
  resolver: zodResolver(loginSchema),
  defaultValues: {
    email: "",
    password: "",
  },
});
```

### 4. Routing

#### Centralized Route Configuration

```typescript
// routes.config.ts - Single source of truth
export const ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/",
  USERS: {
    LIST: "/users",
    ADMINS: "/users/admins",
    STUDENTS: "/users/students",
  },
} as const;

// Helper function for active state detection
export function isActiveRoute(currentPath: string, routePath: string): boolean {
  return currentPath === routePath || currentPath.startsWith(routePath + "/");
}
```

#### Protected Routes

```typescript
// ProtectedRoute.tsx - Route protection wrapper
<ProtectedRoute fallback={<LoginForm />}>
  <Outlet />
</ProtectedRoute>
```

### 5. UI Component Patterns

#### shadcn/ui Integration

- Use existing shadcn/ui components when possible
- Extend components with variants using CVA
- Follow shadcn/ui naming conventions

#### Component Variants

```typescript
// Use Class Variance Authority for component variants
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

### 6. TypeScript Best Practices

#### Type Definitions

```typescript
// Domain types in feature/domain/
export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  userType: "admin" | "student" | "teacher";
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
```

#### Strict Typing

- Use `as const` for route definitions
- Prefer interfaces over types for object shapes
- Use generic types for reusable components

### 7. Styling Guidelines

#### Tailwind CSS Usage

```typescript
// Use utility classes for styling
<div className="flex flex-col space-y-4 p-6">
  <h1 className="text-2xl font-bold tracking-tight">Title</h1>
</div>

// Use CSS variables for theme colors
--primary: 24 95% 53%;
--background: 0 0% 100%;
```

#### Responsive Design

```typescript
// Mobile-first approach
<div className="p-4 sm:p-6 lg:p-8">
  <h1 className="text-xl sm:text-2xl lg:text-3xl">Title</h1>
</div>
```

### 8. Error Handling

#### Error Boundaries

```typescript
// Wrap components with error boundaries
<ErrorBoundary fallback={<ErrorPage />}>
  <Component />
</ErrorBoundary>
```

#### API Error Handling

```typescript
// Use React Query error handling
const { error } = useQuery({
  queryKey: ["users"],
  queryFn: () => userApi.getUsers(),
  onError: (error) => {
    toast.error("Failed to fetch users");
  },
});
```

### 9. Testing Guidelines

#### Component Testing

- Test component behavior, not implementation
- Use meaningful test descriptions
- Test user interactions and edge cases

#### Integration Testing

- Test feature flows
- Test API integration
- Test routing behavior

### 10. Performance Optimization

#### Code Splitting

```typescript
// Lazy load routes
const Dashboard = lazy(() => import("./features/dashboard/Dashboard"));
const Users = lazy(() => import("./features/users/UserList"));
```

#### Memoization

```typescript
// Use React.memo for expensive components
export const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* expensive rendering */}</div>;
});

// Use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);
```

## Development Workflow

### 1. Feature Development

1. Create feature folder structure
2. Define domain models and types
3. Implement infrastructure layer (API calls)
4. Create application layer (use cases, hooks)
5. Build presentation layer (components)
6. Add routes and navigation
7. Write tests

### 2. Component Development

1. Define props interface
2. Implement component logic
3. Add styling with Tailwind
4. Create variants if needed
5. Add accessibility features
6. Write tests

### 3. Code Review Checklist

- [ ] TypeScript types are correct
- [ ] Components follow naming conventions
- [ ] Imports are organized correctly
- [ ] Error handling is implemented
- [ ] Accessibility is considered
- [ ] Responsive design is implemented
- [ ] Tests are included
- [ ] Documentation is updated

## Configuration Files

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

### ESLint Configuration

- Uses React hooks plugin
- TypeScript ESLint rules
- Custom rules for code quality

### Tailwind Configuration

- Custom color palette
- Extended theme configuration
- Responsive breakpoints

## Conclusion

This architecture provides a solid foundation for scalable, maintainable React applications. Following these patterns ensures consistency, type safety, and excellent developer experience.

Key principles:

1. **Separation of Concerns** - Clear boundaries between layers
2. **Type Safety** - Leverage TypeScript throughout
3. **Reusability** - Shared components and utilities
4. **Maintainability** - Consistent patterns and organization
5. **Performance** - Optimized rendering and code splitting

This structure allows AI assistants to quickly understand the codebase and follow established patterns when generating code or making modifications.
