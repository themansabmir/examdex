import {
  UserService,
  UserController,
  InMemoryUserRepository,
  ExamService,
  ExamController,
  InMemoryExamRepository,
} from "./features";
import { OtpService } from "./otp/otp.service";
import { prisma } from "./lib/prisma";

// Repositories
const userRepository = new InMemoryUserRepository();
const examRepository = new InMemoryExamRepository();

// Services
const otpService = new OtpService(prisma);
const userService = new UserService(userRepository, otpService);
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
  otpService,
};
