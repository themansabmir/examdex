import type { IUserRepository } from "./user.repository";
import { User } from "./user.entity";
import type { CreateUserInputDTO, CreateUserOutputDTO } from "./user.dto";
import { ConflictError } from "../../utils";
import twilio from "twilio";
import jwt from "jsonwebtoken";
import { env } from "../../config";
import { IOtpRepository } from "./otp.repository";
import { logger } from "../../utils/logger";

export class UserService {
  private twilioClient: twilio.Twilio | null = null;

  constructor(
    private readonly userRepository: IUserRepository,
    private readonly otpRepository: IOtpRepository
  ) {
    if (env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN) {
      this.twilioClient = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
    }
  }

  async sendOtp(mobileNumber: string) {
    // Check if user exists, if not create one (auto-signup)
    let user = await this.userRepository.findByMobileNumber(mobileNumber);

    if (!user) {
      user = new User({
        mobileNumber,
        role: "student",
      });
      await this.userRepository.save(user);
    }

    // Use Twilio Verify if configured
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

    // Fallback to Manual OTP (Mock/Dev or if Verify SID missing)
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await this.otpRepository.save({
      mobileNumber,
      code: otpCode,
      expiresAt,
    });

    if (this.twilioClient && env.TWILIO_PHONE_NUMBER) {
      try {
        await this.twilioClient.messages.create({
          body: `Your ExamDex OTP is: ${otpCode}`,
          from: env.TWILIO_PHONE_NUMBER,
          to: mobileNumber,
        });
      } catch (error) {
        // Ignore error
      }
    }

    return { message: "OTP sent successfully", code: env.isDevelopment ? otpCode : undefined };
  }

  async verifyOtp(mobileNumber: string, code: string) {
    let isValid = false;

    // Use Twilio Verify if configured
    if (this.twilioClient && env.TWILIO_VERIFY_SERVICE_SID) {
      try {
        const verificationCheck = await this.twilioClient.verify.v2
          .services(env.TWILIO_VERIFY_SERVICE_SID)
          .verificationChecks.create({ to: mobileNumber, code });

        if (verificationCheck.status === "approved") {
          isValid = true;
        }
      } catch (error) {
        logger.error("Failed to verify OTP via Twilio Verify:", error as Error);
        // Fallthrough to check local DB just in case (optional, but safer to fail if verify is configured)
      }
    }

    // If not verified by Twilio (or not configured), check local DB
    if (!isValid) {
      const otpRecord = await this.otpRepository.findLatest(mobileNumber, code);
      if (otpRecord) {
        isValid = true;
        // Clean up used OTP
        await this.otpRepository.deleteByMobileNumber(mobileNumber);
      }
    }

    if (!isValid) {
      throw new Error("Invalid or expired OTP");
    }

    const user = await this.userRepository.findByMobileNumber(mobileNumber);
    if (!user) {
      throw new Error("User not found");
    }

    const token = jwt.sign(
      { id: user.id, mobileNumber: user.mobileNumber!, role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as any }
    );

    return {
      token,
      user: {
        id: user.id,
        mobileNumber: user.mobileNumber,
        name: user.name,
        role: user.role,
      },
    };
  }

  async createUser(input: CreateUserInputDTO): Promise<CreateUserOutputDTO> {
    if (input.mobileNumber) {
      const existingUser = await this.userRepository.findByMobileNumber(input.mobileNumber);
      if (existingUser) {
        throw new ConflictError("User with this mobile number already exists", "USER_EXISTS");
      }
    }

    const user = new User({
      mobileNumber: input.mobileNumber,
      name: input.name,
      role: input.role,
    });

    const savedUser = await this.userRepository.save(user);

    return {
      id: savedUser.id,
      email: savedUser.email,
      mobileNumber: savedUser.mobileNumber,
      name: savedUser.name,
      role: savedUser.role,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
    };
  }

  async getUserById(id: string): Promise<CreateUserOutputDTO | null> {
    const user = await this.userRepository.findById(id);
    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      mobileNumber: user.mobileNumber,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async getAllUsers(): Promise<CreateUserOutputDTO[]> {
    const users = await this.userRepository.findAll();

    return users.map((user) => ({
      id: user.id,
      email: user.email,
      mobileNumber: user.mobileNumber,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }
}
