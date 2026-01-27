import {
  UserService,
  UserController,
  InMemoryUserRepository,
  ExamService,
  ExamController,
  InMemoryExamRepository,
  InMemoryOtpRepository,
} from "./features";

// Repositories - swap between Prisma and InMemory based on environment
// For now, defaulting to InMemory to avoid DB connection issues as requested
const userRepository = new InMemoryUserRepository();
const otpRepository = new InMemoryOtpRepository();
const examRepository = new InMemoryExamRepository();

// Services
const userService = new UserService(userRepository, otpRepository);
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
  otpRepository,
  userService,
  examService,
};
