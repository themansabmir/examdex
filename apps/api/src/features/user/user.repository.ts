import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { User } from "./user.entity";

export interface UpdateUserData {
  fullName?: string;
  email?: string | null;
  phoneNumber?: string | null;
  passwordHash?: string;
  isActive?: boolean;
  isOnboarded?: boolean;
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
  findAll(options?: {
    userType?: string | string[];
    excludeStudent?: boolean;
    onlyActive?: boolean;
  }): Promise<User[]>;
  update(id: string, data: UpdateUserData): Promise<User>;
  delete(id: string): Promise<void>;
  upsertExamPreference(userId: string, examId: string): Promise<void>;
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
      isOnboarded: user.isOnboarded,
      deviceFingerprint: user.deviceFingerprint,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
    });
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        examPreferences: {
          where: { isPrimary: true },
          include: { exam: true },
        },
      },
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
      isOnboarded: user.isOnboarded,
      deviceFingerprint: user.deviceFingerprint,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      currentExam: user.examPreferences[0]
        ? {
            id: user.examPreferences[0].exam.id,
            name: user.examPreferences[0].exam.examName,
          }
        : undefined,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        examPreferences: {
          where: { isPrimary: true },
          include: { exam: true },
        },
      },
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
      isOnboarded: user.isOnboarded,
      deviceFingerprint: user.deviceFingerprint,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      currentExam: user.examPreferences[0]
        ? {
            id: user.examPreferences[0].exam.id,
            name: user.examPreferences[0].exam.examName,
          }
        : undefined,
    });
  }

  async findByPhone(phone: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { phoneNumber: phone },
      include: {
        examPreferences: {
          where: { isPrimary: true },
          include: { exam: true },
        },
      },
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
      isOnboarded: user.isOnboarded,
      deviceFingerprint: user.deviceFingerprint,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      currentExam: user.examPreferences[0]
        ? {
            id: user.examPreferences[0].exam.id,
            name: user.examPreferences[0].exam.examName,
          }
        : undefined,
    });
  }

  async findAll(options?: {
    userType?: string | string[];
    excludeStudent?: boolean;
    onlyActive?: boolean;
  }): Promise<User[]> {
    const where: any = {};

    if (options?.userType || options?.excludeStudent || options?.onlyActive) {
      const conditions: any[] = [];

      if (options?.userType) {
        conditions.push({
          userType: Array.isArray(options.userType)
            ? { in: options.userType as any }
            : (options.userType as any),
        });
      }

      if (options?.excludeStudent) {
        conditions.push({ userType: { not: "student" } });
      }

      if (options?.onlyActive) {
        conditions.push({ isActive: true });
      }

      if (conditions.length > 0) {
        where.AND = conditions;
      }
    }

    const users = await this.prisma.user.findMany({
      where,
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
          isOnboarded: user.isOnboarded,
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
    if (data.isOnboarded !== undefined) {
      updateData.isOnboarded = data.isOnboarded;
    }
    if (data.passwordHash !== undefined) {
      updateData.passwordHash = data.passwordHash;
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
      isOnboarded: user.isOnboarded,
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

  async upsertExamPreference(userId: string, examId: string): Promise<void> {
    // Check if the exam preference exists
    const existingPreference = await this.prisma.userExamPreference.findUnique({
      where: {
        userId_examId: {
          userId,
          examId,
        },
      },
    });

    if (existingPreference) {
      await this.prisma.userExamPreference.update({
        where: {
          id: existingPreference.id,
        },
        data: {
          isPrimary: true,
        },
      });
    } else {
      // Create new preference
      const examSubject = await this.prisma.examSubject.findFirst({
        where: { examId },
      });

      if (!examSubject) {
        throw new Error("Exam has no subjects configured");
      }

      await this.prisma.userExamPreference.create({
        data: {
          userId,
          examId,
          subjectId: examSubject.subjectId,
          isPrimary: true,
        },
      });
    }

    // Unset other primary preferences for this user
    await this.prisma.userExamPreference.updateMany({
      where: {
        userId,
        examId: { not: examId },
      },
      data: {
        isPrimary: false,
      },
    });
  }
}
