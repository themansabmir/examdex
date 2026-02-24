import { prisma } from "../lib";
import {
  UserService,
  UserController,
  PrismaUserRepository,
  DefaultCreditConfigService,
  PrismaDefaultCreditConfigRepository,
} from "../features";
import { DefaultCreditConfigController } from "../features/user/default-credit-config.controller";

export const userRepository = new PrismaUserRepository(prisma);
export const userService = new UserService(userRepository);
export const userController = new UserController(userService);

export const defaultCreditConfigRepository = new PrismaDefaultCreditConfigRepository(prisma);
export const defaultCreditConfigService = new DefaultCreditConfigService(
  defaultCreditConfigRepository
);
export const defaultCreditConfigController = new DefaultCreditConfigController(
  defaultCreditConfigService
);
