import { PrismaClient } from "@prisma/client";
import twilio from "twilio";
import { env } from "../config";
import { logger } from "../utils/logger";

export type OtpType = "login" | "signup" | "forgot_password" | "number_change";

export interface Otp {
  id?: string;
  mobileNumber: string;
  code: string;
  expiresAt: Date;
  createdAt?: Date;
}

export interface IOtpRepository {
  save(otp: Omit<Otp, "id" | "createdAt">): Promise<Otp>;
  findLatest(mobileNumber: string, code: string): Promise<Otp | null>;
  deleteByMobileNumber(mobileNumber: string): Promise<void>;

  // Abstraction for decision making
  shouldUseProviderVerification(): boolean;

  // Twilio / Verification specific methods
  sendSms(to: string, message: string): Promise<void>;
  sendVerify(to: string, channel?: "sms" | "call"): Promise<void>;
  checkVerify(to: string, code: string): Promise<boolean>;
}

export class OtpRepository implements IOtpRepository {
  private twilioClient: twilio.Twilio | null = null;

  constructor(private readonly prisma: PrismaClient) {
    if (env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN) {
      this.twilioClient = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
    }
  }

  async save(otp: Omit<Otp, "id" | "createdAt">): Promise<Otp> {
    return await this.prisma.otp.create({
      data: {
        mobileNumber: otp.mobileNumber,
        code: otp.code,
        expiresAt: otp.expiresAt,
      },
    });
  }

  async findLatest(mobileNumber: string, code: string): Promise<Otp | null> {
    return await this.prisma.otp.findFirst({
      where: {
        mobileNumber,
        code,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async deleteByMobileNumber(mobileNumber: string): Promise<void> {
    await this.prisma.otp.deleteMany({
      where: { mobileNumber },
    });
  }

  async sendSms(to: string, message: string): Promise<void> {
    if (this.twilioClient && env.TWILIO_PHONE_NUMBER) {
      try {
        await this.twilioClient.messages.create({
          body: message,
          from: env.TWILIO_PHONE_NUMBER,
          to,
        });
      } catch (error) {
        logger.error("Failed to send OTP SMS:", error as Error);
        // We might not want to throw here to allow fallback or just logging
        throw new Error("Failed to send SMS");
      }
    } else {
      logger.warn("Twilio client or phone number not configured. SMS not sent.");
    }
  }

  async sendVerify(to: string, channel: "sms" | "call" = "sms"): Promise<void> {
    if (this.twilioClient && env.TWILIO_VERIFY_SERVICE_SID) {
      try {
        await this.twilioClient.verify.v2
          .services(env.TWILIO_VERIFY_SERVICE_SID)
          .verifications.create({ to, channel });
      } catch (error) {
        logger.error("Failed to send OTP via Twilio Verify:", error as Error);
        throw new Error("Failed to send Verify OTP");
      }
    } else {
      logger.warn("Twilio client or verify service SID not configured. Verify not sent.");
    }
  }

  async checkVerify(to: string, code: string): Promise<boolean> {
    if (this.twilioClient && env.TWILIO_VERIFY_SERVICE_SID) {
      try {
        const verificationCheck = await this.twilioClient.verify.v2
          .services(env.TWILIO_VERIFY_SERVICE_SID)
          .verificationChecks.create({ to, code });

        return verificationCheck.status === "approved";
      } catch (error) {
        logger.error("Failed to verify OTP via Twilio Verify:", error as Error);
        return false;
      }
    }
    return false;
  }

  shouldUseProviderVerification(): boolean {
    return !!(this.twilioClient && env.TWILIO_VERIFY_SERVICE_SID);
  }
}
