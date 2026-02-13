import { AuthService, AuthController } from "../features";
import { userRepository } from "./user.container";
import { otpService, jwtService, smtpService } from "./shared.container";
import { PrismaInvitationRepository } from "../features/auth/invitation.repository";
import { prisma } from "../lib";

export const invitationRepository = new PrismaInvitationRepository(prisma);

export const authService = new AuthService(
  userRepository,
  otpService,
  jwtService,
  invitationRepository,
  smtpService
);
export const authController = new AuthController(authService);
