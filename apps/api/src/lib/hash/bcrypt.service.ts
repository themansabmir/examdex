import bcrypt from "bcryptjs";
import { IHashService } from "./hash.service";

export class BcryptService implements IHashService {
  private readonly rounds = 10;

  async hash(data: string, saltOrRounds?: string | number): Promise<string> {
    return bcrypt.hash(data, saltOrRounds ?? this.rounds);
  }

  async compare(data: string, encrypted: string): Promise<boolean> {
    return bcrypt.compare(data, encrypted);
  }
}
