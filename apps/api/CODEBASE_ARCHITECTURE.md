# ExamDex API - Codebase Architecture & Best Practices

## Overview

This document outlines the architecture, folder structure, and best practices for the ExamDex API application. This serves as a comprehensive guide for future development and AI context understanding.

## Technology Stack

### Core Technologies

- **Node.js** - JavaScript runtime
- **TypeScript 5.7.2** - Type safety and better DX
- **Express 4.21.2** - Web framework
- **Prisma 7.2.0** - ORM and database toolkit
- **PostgreSQL** - Primary database

### Authentication & Security

- **JWT (jsonwebtoken)** - Token-based authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

### Communication & Services

- **Nodemailer** - Email service
- **Twilio** - SMS service
- **Zod 3.25.76** - Schema validation

### Development Tools

- **tsx** - TypeScript execution
- **ESLint** - Code linting
- **Prisma Studio** - Database GUI

## Folder Structure

```
src/
├── config/                # Configuration management
│   ├── env.ts            # Environment variables
│   └── index.ts          # Config exports
├── features/             # Feature-based modules
│   ├── auth/             # Authentication feature
│   ├── user/             # User management
│   ├── exam/             # Exam management
│   ├── subject/          # Subject management
│   ├── chapter/          # Chapter management
│   └── dev/              # Development utilities
├── lib/                  # Core libraries and utilities
│   ├── jwt/              # JWT utilities
│   ├── otp/              # OTP generation/verification
│   ├── smtp/             # Email service
│   ├── twilio/           # SMS service
│   └── prisma.ts         # Database connection
├── middleware/           # Express middleware
│   ├── error-handler.ts  # Global error handling
│   ├── not-found.ts      # 404 handling
│   ├── request-logger.ts # Request logging
│   └── validate-request.ts # Request validation
├── routes/               # Route definitions
├── utils/                # Utility functions
├── container.ts          # Dependency injection
└── main.ts               # Application entry point
```

## Architecture Patterns

### 1. Feature-Driven Development

Each feature follows a clean architecture pattern:

```
features/
├── auth/
│   ├── auth.controller.ts # HTTP request handling
│   ├── auth.service.ts    # Business logic
│   ├── auth.dto.ts         # Data transfer objects
│   ├── auth.schema.ts      # Validation schemas
│   └── index.ts           # Feature exports
```

**Benefits:**

- Clear separation of concerns
- Easy testing and maintenance
- Scalable feature organization
- Dependency injection support

### 2. Layered Architecture

**Controller Layer** (`*.controller.ts`)

- HTTP request/response handling
- Request validation
- Response formatting
- Error handling delegation

**Service Layer** (`*.service.ts`)

- Business logic implementation
- Data transformation
- External service integration
- Transaction management

**Data Layer** (Prisma)

- Database operations
- Data persistence
- Relationship management
- Query optimization

### 3. Dependency Injection

Using a custom DI container (`container.ts`):

```typescript
// Service registration
container.register<IAuthService>("AuthService", {
  useClass: AuthService,
});

// Service resolution
const authService = container.get<IAuthService>("AuthService");
```

## Database Architecture

### 1. RBAC (Role-Based Access Control)

```prisma
// Core RBAC models
model Role {
  id          String   @id @default(uuid())
  roleName    String   @unique
  description String?
  isActive    Boolean  @default(true)

  userRoles       UserRole[]
  rolePermissions RolePermission[]
}

model Permission {
  id             String  @id @default(uuid())
  permissionName String  @unique
  resource       String
  action         String

  rolePermissions RolePermission[]
}

model RolePermission {
  id           String @id @default(uuid())
  roleId       String
  permissionId String

  role       Role       @relation(fields: [roleId], references: [id])
  permission Permission @relation(fields: [permissionId], references: [id])

  @@unique([roleId, permissionId])
}
```

### 2. User Management

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  firstName String   @map("first_name")
  lastName  String   @map("last_name")
  isActive  Boolean  @default(true)

  userRoles UserRole[]

  @@map("users")
}

model UserRole {
  id     String @id @default(uuid())
  userId String @map("user_id")
  roleId String @map("role_id")

  user User @relation(fields: [userId], references: [id])
  role Role @relation(fields: [roleId], references: [id])

  @@unique([userId, roleId])
}
```

## Best Practices

### 1. File Organization

#### Naming Conventions

- **Controllers**: `*.controller.ts` (e.g., `auth.controller.ts`)
- **Services**: `*.service.ts` (e.g., `auth.service.ts`)
- **DTOs**: `*.dto.ts` (e.g., `auth.dto.ts`)
- **Schemas**: `*.schema.ts` (e.g., `auth.schema.ts`)
- **Middleware**: `*.middleware.ts` or `*.ts` in middleware folder
- **Types**: PascalCase interfaces (e.g., `IAuthService`)

#### Import Organization

```typescript
// External libraries first
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";

// Internal imports (relative paths)
import { IAuthService } from "./auth.service";
import { AdminLoginInputDTO } from "./auth.dto";
import { HttpStatus } from "../../utils/app-error";
```

### 2. Controller Patterns

#### Standard Controller Structure

```typescript
export class AuthController {
  constructor(private readonly authService: IAuthService) {}

  // Method naming: HTTP verb + resource
  adminLogin = async (req: Request, res: Response): Promise<void> => {
    try {
      // 1. Extract and validate input
      const input: AdminLoginInputDTO = req.body;

      // 2. Call service layer
      const result = await this.authService.adminLogin(input);

      // 3. Set cookies if needed
      res.cookie("refreshToken", result.refreshToken, this.cookieOptions);

      // 4. Send response
      res.status(HttpStatus.OK).json({
        success: true,
        data: {
          accessToken: result.accessToken,
          user: result.user,
        },
      });
    } catch (error) {
      // 5. Error handling (middleware will catch)
      throw error;
    }
  };
}
```

#### Response Format

```typescript
// Success response
{
  "success": true,
  "data": { ... },
  "message?: "Optional message"
}

// Error response (handled by error middleware)
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details?: { ... }
  }
}
```

### 3. Service Layer Patterns

#### Service Interface

```typescript
export interface IAuthService {
  adminLogin(input: AdminLoginInputDTO): Promise<AuthResult>;
  studentAuth(input: StudentAuthInputDTO): Promise<StudentAuthResult>;
  verifyOtp(input: VerifyOtpInputDTO): Promise<OtpVerificationResult>;
  refreshToken(input: RefreshTokenInputDTO): Promise<TokenRefreshResult>;
}
```

#### Service Implementation

```typescript
export class AuthService implements IAuthService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService
  ) {}

  async adminLogin(input: AdminLoginInputDTO): Promise<AuthResult> {
    // 1. Validate input
    // 2. Find user
    // 3. Verify credentials
    // 4. Generate tokens
    // 5. Return result
  }
}
```

### 4. Data Transfer Objects (DTOs)

#### DTO Structure

```typescript
// auth.dto.ts
export interface AdminLoginInputDTO {
  email: string;
  password: string;
}

export interface StudentAuthInputDTO {
  phone: string;
}

export interface VerifyOtpInputDTO {
  phone: string;
  otp: string;
}

export interface RefreshTokenInputDTO {
  refreshToken: string;
}
```

### 5. Validation with Zod

#### Schema Definition

```typescript
// auth.schema.ts
import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const studentAuthSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid phone number"),
});

export const verifyOtpSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid phone number"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});
```

### 6. Middleware Patterns

#### Error Handling Middleware

```typescript
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log error
  logger.error("Error occurred", error);

  // Handle different error types
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
      },
    });
    return;
  }

  // Default error response
  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred",
    },
  });
};
```

#### Request Validation Middleware

```typescript
export const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid input data",
            details: error.errors,
          },
        });
        return;
      }
      next(error);
    }
  };
};
```

### 7. Database Patterns

#### Prisma Client Usage

```typescript
// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

#### Service Layer Database Operations

```typescript
async findUserByEmail(email: string): Promise<User | null> {
  return this.prisma.user.findUnique({
    where: { email },
    include: {
      userRoles: {
        include: {
          role: {
            include: {
              rolePermissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      },
    },
  });
}
```

### 8. Authentication & Authorization

#### JWT Service

```typescript
// lib/jwt/jwt.service.ts
export class JwtService {
  generateAccessToken(payload: any): string {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN || "15m",
    });
  }

  generateRefreshToken(payload: any): string {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    });
  }

  verifyToken(token: string): any {
    return jwt.verify(token, process.env.JWT_SECRET!);
  }
}
```

#### Permission-based Authorization

```typescript
async hasPermission(userId: string, resource: string, action: string): Promise<boolean> {
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
    include: {
      userRoles: {
        include: {
          role: {
            include: {
              rolePermissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return user?.userRoles.some(role =>
    role.role.rolePermissions.some(rp =>
      rp.permission.resource === resource && rp.permission.action === action
    )
  ) || false;
}
```

### 9. External Service Integration

#### Email Service

```typescript
// lib/smtp/email.service.ts
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
    });
  }
}
```

#### SMS Service (Twilio)

```typescript
// lib/twilio/sms.service.ts
export class SmsService {
  private client: twilio.Twilio;

  constructor() {
    this.client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }

  async sendSms(to: string, body: string): Promise<void> {
    await this.client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
  }
}
```

### 10. Environment Configuration

#### Environment Variables

```typescript
// config/env.ts
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  PORT: z.string().transform(Number).default("3000"),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),

  // Email configuration
  SMTP_HOST: z.string(),
  SMTP_PORT: z.string().transform(Number),
  SMTP_USER: z.string(),
  SMTP_PASS: z.string(),
  SMTP_FROM: z.string(),

  // SMS configuration
  TWILIO_ACCOUNT_SID: z.string(),
  TWILIO_AUTH_TOKEN: z.string(),
  TWILIO_PHONE_NUMBER: z.string(),
});

export const env = envSchema.parse(process.env);

export function validateEnv(): void {
  try {
    envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Invalid environment variables:");
      error.errors.forEach((err) => {
        console.error(`  ${err.path.join(".")}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
}
```

### 11. Error Handling

#### Custom Error Classes

```typescript
// utils/app-error.ts
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = "Bad request") {
    super(message, HttpStatus.BAD_REQUEST, "BAD_REQUEST");
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, HttpStatus.UNAUTHORIZED, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super(message, HttpStatus.FORBIDDEN, "FORBIDDEN");
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Not found") {
    super(message, HttpStatus.NOT_FOUND, "NOT_FOUND");
  }
}
```

#### HTTP Status Codes

```typescript
// utils/app-error.ts
export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
```

### 12. Logging

#### Logger Configuration

```typescript
// utils/logger.ts
import winston from "winston";

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: "examdex-api" },
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}
```

### 13. Testing Guidelines

#### Unit Testing Structure

```typescript
// tests/features/auth/auth.service.test.ts
import { AuthService } from "../../../../src/features/auth/auth.service";
import { mockPrisma, mockJwtService } from "../../../mocks";

describe("AuthService", () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService(mockPrisma, mockJwtService);
  });

  describe("adminLogin", () => {
    it("should return tokens for valid credentials", async () => {
      // Arrange
      const input = { email: "admin@example.com", password: "password123" };

      // Act
      const result = await authService.adminLogin(input);

      // Assert
      expect(result).toHaveProperty("accessToken");
      expect(result).toHaveProperty("refreshToken");
      expect(result).toHaveProperty("user");
    });
  });
});
```

## Development Workflow

### 1. Feature Development

1. Create feature folder structure
2. Define database schema (if needed)
3. Create DTOs and validation schemas
4. Implement service layer
5. Create controller with routes
6. Add middleware and error handling
7. Write tests
8. Update documentation

### 2. Database Workflow

```bash
# Create migration
npx prisma migrate dev --name add_feature

# Generate client
npx prisma generate

# View database
npx prisma studio
```

### 3. Development Commands

```bash
# Development
npm run dev

# Build
npm run build

# Lint
npm run lint

# Type check
npm run typecheck

# Database operations
npm run db:generate
npm run db:migrate
npm run db:push
npm run db:studio
```

## Configuration Files

### Package.json Scripts

```json
{
  "scripts": {
    "build": "tsc",
    "dev": "tsx watch src/main.ts",
    "start": "node dist/main.js",
    "lint": "eslint src --ext .ts",
    "typecheck": "tsc --noEmit",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:push": "prisma db push",
    "db:studio": "prisma studio"
  }
}
```

### Docker Configuration

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

## Security Best Practices

### 1. Authentication

- JWT tokens with expiration
- Refresh token rotation
- Secure cookie settings
- Rate limiting on auth endpoints

### 2. Authorization

- Role-based access control (RBAC)
- Permission-based checks
- Resource-level authorization

### 3. Data Protection

- Input validation with Zod
- SQL injection prevention (Prisma)
- XSS protection (Helmet)
- CORS configuration

### 4. Environment Security

- Environment variable validation
- Secret management
- Production-ready defaults

## Performance Optimization

### 1. Database Optimization

- Proper indexing
- Query optimization
- Connection pooling
- Eager loading with Prisma includes

### 2. Caching Strategy

- JWT token caching
- Database query caching
- Response caching where appropriate

### 3. API Performance

- Request payload limits
- Response compression
- Efficient error handling
- Graceful degradation

## Conclusion

This architecture provides a robust, scalable, and maintainable foundation for the ExamDex API. Following these patterns ensures consistency, security, and excellent developer experience.

Key principles:

1. **Feature-Driven Development** - Organized by business capabilities
2. **Clean Architecture** - Clear separation of concerns
3. **Type Safety** - Comprehensive TypeScript usage
4. **Security First** - Authentication, authorization, and data protection
5. **Developer Experience** - Tooling and patterns for productivity
6. **Maintainability** - Consistent patterns and documentation

This structure allows AI assistants to quickly understand the codebase and follow established patterns when generating code or making modifications.
