import bcrypt from "bcryptjs";
import { IUserRepository } from "../user/user.repository";
import { OtpService, OtpChannel } from "../../lib/otp";
import { JwtService } from "../../lib/jwt";
import {
  AdminLoginInputDTO,
  StudentAuthInputDTO,
  VerifyOtpInputDTO,
  AuthTokensOutputDTO,
  RefreshTokenInputDTO,
  OtpSentOutputDTO,
} from "./auth.dto";
import { UnauthorizedError, BadRequestError, NotFoundError } from "../../utils/app-error";
import { User } from "../user/user.entity";

export interface IAuthService {
  adminLogin(input: AdminLoginInputDTO): Promise<AuthTokensOutputDTO>;
  studentAuth(input: StudentAuthInputDTO): Promise<OtpSentOutputDTO>;
  verifyOtp(input: VerifyOtpInputDTO): Promise<AuthTokensOutputDTO>;
  refreshToken(input: RefreshTokenInputDTO): Promise<AuthTokensOutputDTO>;
}

export class AuthService implements IAuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly otpService: OtpService,
    private readonly jwtService: JwtService
  ) {}

  async adminLogin(input: AdminLoginInputDTO): Promise<AuthTokensOutputDTO> {
    const user = await this.userRepository.findByEmail(input.email);

    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    if (!user.isActive) {
      throw new UnauthorizedError("Account is inactive");
    }

    this.validateAdminUser(user);
    await this.verifyPassword(input.password, user.passwordHash);

    await this.userRepository.update(user.id, { lastLoginAt: new Date() });
    const updatedUser = await this.userRepository.findById(user.id);
    if (!updatedUser) {
      throw new UnauthorizedError("User not found after update");
    }

    return this.generateTokens(updatedUser);
  }

  async studentAuth(input: StudentAuthInputDTO): Promise<OtpSentOutputDTO> {
    const isEmail = this.isEmail(input.phoneOrEmail);
    const { user, userId } = await this.findOrCreateUser(
      input.phoneOrEmail,
      isEmail,
      input.countryCode
    );

    const channel = isEmail ? OtpChannel.EMAIL : OtpChannel.SMS;
    const result = await this.otpService.generateAndSend(userId, channel, input.phoneOrEmail);

    if (!result.success) {
      throw new BadRequestError(result.error || "Failed to send OTP");
    }

    if (!result.expiresAt) {
      throw new BadRequestError("OTP expiration time not available");
    }

    return {
      message: !user
        ? "OTP sent successfully. You will be registered after verification."
        : "OTP sent successfully",
      expiresAt: result.expiresAt,
      isNewUser: !user,
    };
  }

  async verifyOtp(input: VerifyOtpInputDTO): Promise<AuthTokensOutputDTO> {
    const isEmail = this.isEmail(input.phoneOrEmail);
    let user: User | null = null;

    if (isEmail) {
      user = await this.userRepository.findByEmail(input.phoneOrEmail);
    } else {
      const phone = this.normalizePhone(input.phoneOrEmail, input.countryCode);
      user = await this.userRepository.findByPhone(phone);
    }

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const channel = isEmail ? OtpChannel.EMAIL : OtpChannel.SMS;
    const result = await this.otpService.verify(user.id, channel, input.otp);

    if (!result.success) {
      throw new BadRequestError(result.error || "Invalid OTP");
    }

    user = await this.activateUserIfNeeded(user);
    await this.otpService.clear(user.id, channel);

    return this.generateTokens(user);
  }

  async refreshToken(input: RefreshTokenInputDTO): Promise<AuthTokensOutputDTO> {
    try {
      const decoded = this.jwtService.verifyRefreshToken(input.refreshToken);

      const user = await this.userRepository.findById(decoded.userId);

      if (!user) {
        throw new UnauthorizedError("User not found");
      }

      if (!user.isActive) {
        throw new UnauthorizedError("Account is inactive");
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedError(
        error instanceof Error ? error.message : "Invalid or expired refresh token"
      );
    }
  }

  private generateTokens(user: User): AuthTokensOutputDTO {
    const payload = {
      userId: user.id,
      email: user.email || "",
      userType: user.userType,
    };

    const tokens = this.jwtService.generateTokenPair(payload);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phoneNumber,
        fullName: user.fullName,
        userType: user.userType,
        roles: [],
      },
    };
  }

  private validateAdminUser(user: User): void {
    if (user.userType !== "admin" && user.userType !== "content_manager") {
      throw new UnauthorizedError("Access denied. Admin credentials required.");
    }

    if (!user.passwordHash) {
      throw new UnauthorizedError("Invalid email or password");
    }
  }

  private async verifyPassword(password: string, passwordHash: string | null): Promise<void> {
    if (!passwordHash) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }
  }

  private async findOrCreateUser(
    phoneOrEmail: string,
    isEmail: boolean,
    countryCode?: string
  ): Promise<{ user: User | null; userId: string }> {
    let user: User | null = null;

    if (isEmail) {
      user = await this.userRepository.findByEmail(phoneOrEmail);
    } else {
      const phone = this.normalizePhone(phoneOrEmail, countryCode);
      user = await this.userRepository.findByPhone(phone);
    }

    if (!user) {
      try {
        const tempUser = await this.userRepository.save({
          email: isEmail ? phoneOrEmail : null,
          phoneNumber: isEmail ? null : this.normalizePhone(phoneOrEmail, countryCode),
          fullName: isEmail ? phoneOrEmail.split("@")[0] : "Student",
          userType: "student",
          isActive: false,
        });
        return { user: null, userId: tempUser.id };
      } catch (error) {
        if (isEmail) {
          user = await this.userRepository.findByEmail(phoneOrEmail);
        } else {
          const phone = this.normalizePhone(phoneOrEmail, countryCode);
          user = await this.userRepository.findByPhone(phone);
        }
        if (user) {
          return { user, userId: user.id };
        }
        throw error;
      }
    }

    return { user, userId: user.id };
  }

  private async activateUserIfNeeded(user: User): Promise<User> {
    if (!user.isActive) {
      const updatedUser = await this.userRepository.update(user.id, {
        isActive: true,
        lastLoginAt: new Date(),
      });
      return updatedUser;
    }
    await this.userRepository.update(user.id, { lastLoginAt: new Date() });
    const updatedUser = await this.userRepository.findById(user.id);
    if (!updatedUser) {
      throw new NotFoundError("User not found after update");
    }
    return updatedUser;
  }

  private isEmail(input: string): boolean {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(input);
  }

  private normalizePhone(phone: string, countryCode: string = "+91"): string {
    let cleaned = phone.trim();

    if (cleaned.startsWith("+")) {
      cleaned = cleaned.substring(1);
    }

    cleaned = cleaned.replace(/\D/g, "");

    if (cleaned.startsWith(countryCode.replace("+", ""))) {
      return "+" + cleaned;
    }

    return countryCode + cleaned;
  }
}
