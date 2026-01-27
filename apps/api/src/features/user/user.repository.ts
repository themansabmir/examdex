import type { PrismaClient } from "@prisma/client";
import { User } from "./user.entity";

export interface IUserRepository {
  save(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByMobileNumber(mobileNumber: string): Promise<User | null>;
  findAll(): Promise<User[]>;
}

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(user: User): Promise<User> {
    const savedUser = await this.prisma.user.upsert({
      where: { id: user.id },
      update: {
        email: user.email ?? undefined,
        mobileNumber: user.mobileNumber ?? undefined,
        password: user.password ?? undefined,
        name: user.name ?? undefined,
        role: user.role,
      },
      create: {
        id: user.id,
        email: user.email ?? undefined,
        mobileNumber: user.mobileNumber ?? undefined,
        password: user.password ?? undefined,
        name: user.name ?? undefined,
        role: user.role,
      },
    });

    return new User({
      id: savedUser.id,
      email: savedUser.email,
      mobileNumber: savedUser.mobileNumber,
      password: savedUser.password,
      name: savedUser.name,
      role: savedUser.role,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
    });
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return new User({
      id: user.id,
      email: user.email,
      mobileNumber: user.mobileNumber,
      password: user.password,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return new User({
      id: user.id,
      email: user.email,
      mobileNumber: user.mobileNumber,
      password: user.password,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async findByMobileNumber(mobileNumber: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { mobileNumber },
    });

    if (!user) return null;

    return new User({
      id: user.id,
      email: user.email,
      mobileNumber: user.mobileNumber,
      password: user.password,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();

    return users.map(
      (user) =>
        new User({
          id: user.id,
          email: user.email,
          mobileNumber: user.mobileNumber,
          password: user.password,
          name: user.name,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        })
    );
  }
}

export class InMemoryUserRepository implements IUserRepository {
  private users: Map<string, User> = new Map();

  async save(user: User): Promise<User> {
    this.users.set(user.id, user);
    return user;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async findByMobileNumber(mobileNumber: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.mobileNumber === mobileNumber) {
        return user;
      }
    }
    return null;
  }

  async findAll(): Promise<User[]> {
    return Array.from(this.users.values());
  }
}
