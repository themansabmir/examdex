import { User } from "./user.entity";
import type { UserProps } from "./user.entity";

// DTOs
import type { CreateUserInputDTO, CreateUserOutputDTO } from "./user.dto";

// Repository
import type { IUserRepository } from "./user.repository";
import { PrismaUserRepository, InMemoryUserRepository } from "./user.repository";
import type { IOtpRepository } from "./otp.repository";
import { PrismaOtpRepository, InMemoryOtpRepository } from "./otp.repository";

// Service
import { UserService } from "./user.service";

// Controller
import { UserController } from "./user.controller";

// Schemas
export * from "./user.schema";

export { User, UserProps };
export type { CreateUserInputDTO, CreateUserOutputDTO };
export type { IUserRepository, IOtpRepository };
export { PrismaUserRepository, InMemoryUserRepository, PrismaOtpRepository, InMemoryOtpRepository };
export { UserService };
export { UserController };
