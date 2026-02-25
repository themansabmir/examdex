import { BcryptService, prisma } from "../lib";
import { UserService, UserController, PrismaUserRepository } from "../features";
import { creditMasterService } from "./credit-master.container";
const hashService = new BcryptService();
export const userRepository = new PrismaUserRepository(prisma);
export const userService = new UserService(userRepository, creditMasterService, hashService);
export const userController = new UserController(userService);
