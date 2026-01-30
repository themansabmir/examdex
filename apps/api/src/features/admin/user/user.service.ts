import { Request, Response } from "express";
import { IUserRepository } from "./user.repository";
import { CreateUserInputDTO, UserOutputDTO } from "./user.dto";
import { User } from "./user.entity";

export class UserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async createUser(input: CreateUserInputDTO): Promise<UserOutputDTO> {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) throw new Error("User already exists");

    const user = new User(input);
    const saved = await this.userRepository.save(user);
    return this.toDTO(saved);
  }

  async getAll(_req: Request, res: Response): Promise<void> {
    const users = await this.userRepository.findAll();
    res.json(users.map(this.toDTO));
  }

  async getById(id: string): Promise<UserOutputDTO> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new Error("User not found");
    return this.toDTO(user);
  }

  private toDTO(user: User): UserOutputDTO {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }
}
