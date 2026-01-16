import {
  UserService,
  UserController,
  InMemoryUserRepository,
  ExamService,
  ExamController,
  InMemoryExamRepository,
} from "./features";

// Repositories
const userRepository = new InMemoryUserRepository();
const examRepository = new InMemoryExamRepository();

// Services
const userService = new UserService(userRepository);
const examService = new ExamService(examRepository, userRepository);

// Controllers
const userController = new UserController(userService);
const examController = new ExamController(examService);

export { userController, examController };
