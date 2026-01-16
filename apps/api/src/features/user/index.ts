import { User } from "./user.entity";
import type { UserProps } from "./user.entity";

// DTOs
import type { CreateUserInputDTO, CreateUserOutputDTO } from "./user.dto";

// Repository
import type { IUserRepository } from "./user.repository";
import { PrismaUserRepository, InMemoryUserRepository } from "./user.repository";

// Service
import { UserService } from "./user.service";

// Controller
import { UserController } from "./user.controller";

// Schemas
export * from "./user.schema";

export { User, UserProps };
export type { CreateUserInputDTO, CreateUserOutputDTO };
export type { IUserRepository };
export { PrismaUserRepository, InMemoryUserRepository };
export { UserService };
export { UserController };
