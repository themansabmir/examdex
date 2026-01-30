import type { IUserRepository } from "./user.repository";
import { User } from "./user.entity";
import type { CreateUserInputDTO, CreateUserOutputDTO } from "./user.dto";
import { ConflictError } from "../../utils";
import jwt from "jsonwebtoken";
import { env } from "../../config";
import { OtpService } from "../../otp/otp.service";

export class UserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly otpService: OtpService
  ) {}

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

    // Delegate OTP sending to OtpService
    return await this.otpService.sendOtp(mobileNumber);
  }

  async verifyOtp(mobileNumber: string, code: string) {
    const isValid = await this.otpService.verifyOtp(mobileNumber, code);

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
