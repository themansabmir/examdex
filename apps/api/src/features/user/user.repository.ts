import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { User } from "./user.entity";

export interface UpdateUserData {
  fullName?: string;
  email?: string | null;
  phoneNumber?: string | null;
  isActive?: boolean;
  lastLoginAt?: Date;
}

export interface IUserRepository {
  save(data: {
    email?: string | null;
    phoneNumber?: string | null;
    fullName: string;
    password?: string;
    userType: string;
    isActive: boolean;
  }): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByPhone(phone: string): Promise<User | null>;
  findAll(options?: { userType?: string; onlyActive?: boolean }): Promise<User[]>;
  update(id: string, data: UpdateUserData): Promise<User>;
  delete(id: string): Promise<void>;
}

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(data: {
    email?: string | null;
    phoneNumber?: string | null;
    fullName: string;
    password?: string;
    userType: string;
    isActive: boolean;
  }): Promise<User> {
    const passwordHash = data.password ? await bcrypt.hash(data.password, 10) : null;

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        phoneNumber: data.phoneNumber,
        fullName: data.fullName,
        passwordHash,
        userType: data.userType as any,
        isActive: data.isActive,
      },
    });

    return new User({
      id: user.id,
      email: user.email,
      phoneNumber: user.phoneNumber,
      fullName: user.fullName,
      passwordHash: user.passwordHash,
      userType: user.userType,
      creditBalance: user.creditBalance,
      totalCreditsPurchased: user.totalCreditsPurchased,
      isActive: user.isActive,
      deviceFingerprint: user.deviceFingerprint,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
    });
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    return new User({
      id: user.id,
      email: user.email,
      phoneNumber: user.phoneNumber,
      fullName: user.fullName,
      passwordHash: user.passwordHash,
      userType: user.userType,
      creditBalance: user.creditBalance,
      totalCreditsPurchased: user.totalCreditsPurchased,
      isActive: user.isActive,
      deviceFingerprint: user.deviceFingerprint,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    return new User({
      id: user.id,
      email: user.email,
      phoneNumber: user.phoneNumber,
      fullName: user.fullName,
      passwordHash: user.passwordHash,
      userType: user.userType,
      creditBalance: user.creditBalance,
      totalCreditsPurchased: user.totalCreditsPurchased,
      isActive: user.isActive,
      deviceFingerprint: user.deviceFingerprint,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
    });
  }

  async findByPhone(phone: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { phoneNumber: phone },
    });

    if (!user) {
      return null;
    }

    return new User({
      id: user.id,
      email: user.email,
      phoneNumber: user.phoneNumber,
      fullName: user.fullName,
      passwordHash: user.passwordHash,
      userType: user.userType,
      creditBalance: user.creditBalance,
      totalCreditsPurchased: user.totalCreditsPurchased,
      isActive: user.isActive,
      deviceFingerprint: user.deviceFingerprint,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
    });
  }

  async findAll(options?: { userType?: string; onlyActive?: boolean }): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: {
        ...(options?.userType && { userType: options.userType as any }),
        ...(options?.onlyActive && { isActive: true }),
      },
      orderBy: { createdAt: "desc" },
    });

    return users.map(
      (user) =>
        new User({
          id: user.id,
          email: user.email,
          phoneNumber: user.phoneNumber,
          fullName: user.fullName,
          passwordHash: user.passwordHash,
          userType: user.userType,
          creditBalance: user.creditBalance,
          totalCreditsPurchased: user.totalCreditsPurchased,
          isActive: user.isActive,
          deviceFingerprint: user.deviceFingerprint,
          lastLoginAt: user.lastLoginAt,
          createdAt: user.createdAt,
        })
    );
  }

  async update(id: string, data: UpdateUserData): Promise<User> {
    const updateData: any = {};

    if (data.fullName !== undefined) {
      updateData.fullName = data.fullName;
    }
    if (data.email !== undefined) {
      updateData.email = data.email;
    }
    if (data.phoneNumber !== undefined) {
      updateData.phoneNumber = data.phoneNumber;
    }
    if (data.isActive !== undefined) {
      updateData.isActive = data.isActive;
    }
    if (data.lastLoginAt !== undefined) {
      updateData.lastLoginAt = data.lastLoginAt;
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });

    return new User({
      id: user.id,
      email: user.email,
      phoneNumber: user.phoneNumber,
      fullName: user.fullName,
      passwordHash: user.passwordHash,
      userType: user.userType,
      creditBalance: user.creditBalance,
      totalCreditsPurchased: user.totalCreditsPurchased,
      isActive: user.isActive,
      deviceFingerprint: user.deviceFingerprint,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
