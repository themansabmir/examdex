import type { IUserRepository } from "./user.repository";
import { User } from "./user.entity";
import type { CreateUserInputDTO, CreateUserOutputDTO } from "./user.dto";
import { ConflictError } from "../../utils";

export class UserService {
  constructor(
    private readonly userRepository: IUserRepository
  ) { }



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
