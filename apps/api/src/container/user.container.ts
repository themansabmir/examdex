import { prisma } from "../lib";
import { UserService, UserController, PrismaUserRepository } from "../features";

export const userRepository = new PrismaUserRepository(prisma);
export const userService = new UserService(userRepository);
export const userController = new UserController(userService);
