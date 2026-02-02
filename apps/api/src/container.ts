import {
  UserService,
  UserController,
  InMemoryUserRepository,
  ExamService,
  ExamController,
  InMemoryExamRepository,
  AuthService,
  AuthController,
} from "./features";
import { OtpService } from "./otp/otp.service";
import { OtpRepository } from "./otp/otp.repository"; // Import OtpRepository
import { prisma } from "./lib/prisma";

// Repositories
const userRepository = new InMemoryUserRepository();
const examRepository = new InMemoryExamRepository();
const otpRepository = new OtpRepository(prisma); // Instantiate OtpRepository

// Services
const otpService = new OtpService(otpRepository); // Inject OtpRepository
const authService = new AuthService(userRepository, otpService);
const userService = new UserService(userRepository);
const examService = new ExamService(examRepository, userRepository);

// Controllers
const authController = new AuthController(authService);
const userController = new UserController(userService);
const examController = new ExamController(examService);

export {
  userController,
  authController,
  examController,
  // Export for testing
  userRepository,
  examRepository,
  userService,
  examService,
  otpService,
  authService,
};
