import { prisma } from "./lib";
import {
  UserService,
  UserController,
  PrismaUserRepository,
  ExamService,
  ExamController,
  PrismaExamRepository,
  AuthService,
  AuthController,
  SubjectService,
  SubjectController,
  PrismaSubjectRepository,
  ChapterService,
  ChapterController,
  PrismaChapterRepository,
} from "./features";
import { DevController } from "./features/dev";
import { OtpService, PrismaOtpRepository } from "./lib/otp";
import { JwtService } from "./lib/jwt";
import { TwilioService } from "./lib/twilio";
import { SmtpService } from "./lib/smtp";
import { env } from "./config";

// Repositories
const userRepository = new PrismaUserRepository(prisma);
const examRepository = new PrismaExamRepository(prisma);
const subjectRepository = new PrismaSubjectRepository(prisma);
const chapterRepository = new PrismaChapterRepository(prisma);
const otpRepository = new PrismaOtpRepository(prisma);

// External Services
const jwtService = new JwtService({
  accessTokenSecret: env.JWT_ACCESS_SECRET,
  refreshTokenSecret: env.JWT_REFRESH_SECRET,
  accessTokenExpiresIn: env.JWT_ACCESS_EXPIRES_IN,
  refreshTokenExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
});

const twilioService = env.TWILIO_ACCOUNT_SID
  ? new TwilioService({
      accountSid: env.TWILIO_ACCOUNT_SID,
      authToken: env.TWILIO_AUTH_TOKEN,
      phoneNumber: env.TWILIO_PHONE_NUMBER,
    })
  : undefined;

const smtpService = env.SMTP_USER
  ? new SmtpService({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
      from: {
        name: env.SMTP_FROM_NAME,
        email: env.SMTP_FROM_EMAIL,
      },
    })
  : undefined;

const otpService = new OtpService(
  {
    length: env.OTP_LENGTH,
    expiresInMinutes: env.OTP_EXPIRES_IN_MINUTES,
    maxAttempts: env.OTP_MAX_ATTEMPTS,
  },
  otpRepository,
  twilioService,
  smtpService
);

// Services
const userService = new UserService(userRepository);
const examService = new ExamService(examRepository);
const authService = new AuthService(userRepository, otpService, jwtService);
const subjectService = new SubjectService(subjectRepository);
const chapterService = new ChapterService(chapterRepository);

// Controllers
const userController = new UserController(userService);
const examController = new ExamController(examService);
const authController = new AuthController(authService);
const subjectController = new SubjectController(subjectService);
const chapterController = new ChapterController(chapterService);
const devController = new DevController(userService, userRepository);

export {
  userController,
  examController,
  authController,
  subjectController,
  chapterController,
  devController,
  // Export for testing
  userRepository,
  examRepository,
  subjectRepository,
  chapterRepository,
  userService,
  examService,
  authService,
  subjectService,
  chapterService,
};
