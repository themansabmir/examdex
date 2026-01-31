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
  SubjectService,
  SubjectController,
  PrismaSubjectRepository,
  InMemorySubjectRepository,
} from "./features";
import { env } from "./config";

// Repositories - swap between Prisma and InMemory based on environment
const userRepository = env.isTest ? new InMemoryUserRepository() : new PrismaUserRepository(prisma);

const examRepository = env.isTest ? new InMemoryExamRepository() : new PrismaExamRepository(prisma);

const subjectRepository = env.isTest
  ? new InMemorySubjectRepository()
  : new PrismaSubjectRepository(prisma);

// Services
const userService = new UserService(userRepository);
const examService = new ExamService(examRepository);
const subjectService = new SubjectService(subjectRepository);

// Controllers
const userController = new UserController(userService);
const examController = new ExamController(examService);
const subjectController = new SubjectController(subjectService);

export {
  userController,
  examController,
  subjectController,
  // Export for testing
  userRepository,
  examRepository,
  subjectRepository,
  userService,
  examService,
  subjectService,
};
