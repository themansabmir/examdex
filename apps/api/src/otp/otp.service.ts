import { PrismaClient } from "@prisma/client";
import { env } from "../config";
import twilio from "twilio";
import { logger } from "../utils/logger";

export class OtpService {
  private twilioClient: twilio.Twilio | null = null;

  constructor(private readonly prisma: PrismaClient) {
    if (env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN) {
      this.twilioClient = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
    }
  }

  async sendOtp(mobileNumber: string) {
    if (this.twilioClient && env.TWILIO_VERIFY_SERVICE_SID) {
      try {
        await this.twilioClient.verify.v2
          .services(env.TWILIO_VERIFY_SERVICE_SID)
          .verifications.create({ to: mobileNumber, channel: "sms" });

        return { message: "OTP sent successfully" };
      } catch (error) {
        logger.error("Failed to send OTP via Twilio Verify:", error as Error);
        throw new Error("Failed to send OTP");
      }
    }

    await this.deleteByMobileNumber(mobileNumber);

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await this.save(mobileNumber, code, expiresAt);

    if (this.twilioClient && env.TWILIO_PHONE_NUMBER) {
      try {
        await this.twilioClient.messages.create({
          body: `Your ExamDex OTP is: ${code}`,
          from: env.TWILIO_PHONE_NUMBER,
          to: mobileNumber,
        });
      } catch (error) {
        logger.error("Failed to send OTP SMS:", error as Error);
      }
    }

    return {
      message: "OTP sent successfully",
      code: env.isDevelopment ? code : undefined,
    };
  }

  /* ========= VERIFY OTP ========= */
  async verifyOtp(mobileNumber: string, code: string): Promise<boolean> {
    if (this.twilioClient && env.TWILIO_VERIFY_SERVICE_SID) {
      try {
        const verificationCheck = await this.twilioClient.verify.v2
          .services(env.TWILIO_VERIFY_SERVICE_SID)
          .verificationChecks.create({ to: mobileNumber, code });

        if (verificationCheck.status === "approved") {
          return true;
        }
      } catch (error) {
        logger.error("Failed to verify OTP via Twilio Verify:", error as Error);
      }
    }

    const otp = await this.findLatest(mobileNumber, code);

    if (otp) {
      await this.deleteByMobileNumber(mobileNumber);
      return true;
    }

    return false;
  }

  private async save(mobileNumber: string, code: string, expiresAt: Date) {
    return await this.prisma.otp.create({
      data: {
        mobileNumber,
        code,
        expiresAt,
      },
    });
  }

  private async findLatest(mobileNumber: string, code: string) {
    return await this.prisma.otp.findFirst({
      where: {
        mobileNumber,
        code,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  private async deleteByMobileNumber(mobileNumber: string) {
    await this.prisma.otp.deleteMany({
      where: { mobileNumber },
    });
  }
}
