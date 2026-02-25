import { UserType } from "@prisma/client";
import { IUserRepository } from "./user.repository";
import { CreateUserInputDTO, UpdateUserInputDTO, UserOutputDTO } from "./user.dto";
import { ConflictError, NotFoundError } from "../../utils/app-error";
import { User } from "./user.entity";
import { CreditMasterService } from "../creditMaster";
import { IHashService } from "../../lib/hash";

export interface IUserService {
  createUser(input: CreateUserInputDTO): Promise<UserOutputDTO>;
  getUserById(id: string): Promise<UserOutputDTO>;
  getAllUsers(options?: {
    userType?: UserType | UserType[];
    excludeStudent?: boolean;
    onlyActive?: boolean;
  }): Promise<UserOutputDTO[]>;
  updateUser(id: string, input: UpdateUserInputDTO): Promise<UserOutputDTO>;
  deleteUser(id: string): Promise<void>;
  getMe(id: string): Promise<UserOutputDTO>;
  updateMe(id: string, input: UpdateUserInputDTO): Promise<UserOutputDTO>;
}

export class UserService implements IUserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly creditMasterService: CreditMasterService,
    private readonly hashService: IHashService
  ) {}

  async createUser(input: CreateUserInputDTO): Promise<UserOutputDTO> {
    if (!input.email && !input.phone) {
      throw new ConflictError("At least one contact method (email or phone) is required");
    }

    if (input.email) {
      const existingUser = await this.userRepository.findByEmail(input.email);
      if (existingUser) {
        throw new ConflictError("User with this email already exists");
      }
    }

    if (input.phone) {
      const existingUser = await this.userRepository.findByPhone(input.phone);
      if (existingUser) {
        throw new ConflictError("User with this phone number already exists");
      }
    }

    const defaultConfig = await this.creditMasterService.getActiveConfig();
    const defaultCredits = defaultConfig?.creditsPerNewStudent ?? 10;

    const passwordHash = input.password ? await this.hashService.hash(input.password, 10) : null;

    const user = await this.userRepository.save({
      email: input.email || null,
      phoneNumber: input.phone || null,
      fullName: input.fullName,
      passwordHash,
      userType: input.userType,
      isActive: input.isActive ?? true,
      creditBalance: defaultCredits,
      totalCreditsPurchased: 0,
      isOnboarded: false,
      deviceFingerprint: null,
      lastLoginAt: null,
    });

    return this.toOutputDTO(user);
  }

  async getUserById(id: string): Promise<UserOutputDTO> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return this.toOutputDTO(user);
  }

  async getAllUsers(options?: {
    userType?: UserType | UserType[];
    excludeStudent?: boolean;
    onlyActive?: boolean;
  }): Promise<UserOutputDTO[]> {
    const users = await this.userRepository.findAll(options);
    return users.map((user) => this.toOutputDTO(user));
  }

  async updateUser(id: string, input: UpdateUserInputDTO): Promise<UserOutputDTO> {
    const existingUser = await this.userRepository.findById(id);

    if (!existingUser) {
      throw new NotFoundError("User not found");
    }

    if (input.email !== undefined && input.email !== existingUser.email) {
      if (input.email !== null) {
        const userWithEmail = await this.userRepository.findByEmail(input.email);
        if (userWithEmail && userWithEmail.id !== id) {
          throw new ConflictError("User with this email already exists");
        }
      }
    }

    if (input.phone !== undefined && input.phone !== existingUser.phoneNumber) {
      if (input.phone !== null) {
        const userWithPhone = await this.userRepository.findByPhone(input.phone);
        if (userWithPhone && userWithPhone.id !== id) {
          throw new ConflictError("User with this phone number already exists");
        }
      }
    }

    if (input.examId) {
      await this.userRepository.upsertExamPreference(id, input.examId);
    }

    const user = await this.userRepository.update(id, input);
    return this.toOutputDTO(user);
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    await this.userRepository.delete(id);
  }

  async getMe(id: string): Promise<UserOutputDTO> {
    return this.getUserById(id);
  }

  async updateMe(id: string, input: UpdateUserInputDTO): Promise<UserOutputDTO> {
    return this.updateUser(id, input);
  }

  private toOutputDTO(user: User): UserOutputDTO {
    return {
      id: user.id,
      email: user.email,
      phone: user.phoneNumber,
      fullName: user.fullName,
      userType: user.userType,
      roles: [],
      creditBalance: user.creditBalance,
      totalCreditsPurchased: user.totalCreditsPurchased,
      currentExam: user.currentExam,
      deviceFingerprint: user.deviceFingerprint,
      isActive: user.isActive,
      isOnboarded: user.isOnboarded,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
    };
  }
}
