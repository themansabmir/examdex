import { prisma } from "../lib";
import { env } from "../config";
import { JwtService } from "../lib/jwt";
import { TwilioService } from "../lib/twilio";
import { SmtpService } from "../lib/smtp";
import { OtpService, PrismaOtpRepository } from "../lib/otp";

// Repositories
export const otpRepository = new PrismaOtpRepository(prisma);

// External Services
export const jwtService = new JwtService({
  accessTokenSecret: env.JWT_ACCESS_SECRET,
  refreshTokenSecret: env.JWT_REFRESH_SECRET,
  accessTokenExpiresIn: env.JWT_ACCESS_EXPIRES_IN,
  refreshTokenExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
});

export const twilioService = env.TWILIO_ACCOUNT_SID
  ? new TwilioService({
      accountSid: env.TWILIO_ACCOUNT_SID,
      authToken: env.TWILIO_AUTH_TOKEN,
      phoneNumber: env.TWILIO_PHONE_NUMBER,
    })
  : undefined;

export const smtpService = env.SMTP_USER
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

export const otpService = new OtpService(
  {
    length: env.OTP_LENGTH,
    expiresInMinutes: env.OTP_EXPIRES_IN_MINUTES,
    maxAttempts: env.OTP_MAX_ATTEMPTS,
  },
  otpRepository,
  twilioService,
  smtpService
);
