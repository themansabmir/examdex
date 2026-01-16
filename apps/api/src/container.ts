import { prisma } from "./lib";
import {
  UserService,
  UserController,
  PrismaUserRepository,
  InMemoryUserRepository,
  ExamService,
  ExamController,
  PrismaExamRepository,
  InMemoryExamRepository,
} from "./features";
import { env } from "./config";

// Repositories - swap between Prisma and InMemory based on environment
const userRepository = env.isTest ? new InMemoryUserRepository() : new PrismaUserRepository(prisma);

const examRepository = env.isTest ? new InMemoryExamRepository() : new PrismaExamRepository(prisma);

// Services
const userService = new UserService(userRepository);
const examService = new ExamService(examRepository, userRepository);

// Controllers
const userController = new UserController(userService);
const examController = new ExamController(examService);

export {
  userController,
  examController,
  // Export for testing
  userRepository,
  examRepository,
  userService,
  examService,
};
