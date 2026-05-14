import { PrismaClient, UserType } from "@prisma/client";
import { User } from "./user.entity";

export interface SaveUserData {
  email?: string | null;
  phoneNumber?: string | null;
  fullName: string;
  passwordHash?: string | null;
  userType: UserType;
  isActive: boolean;
  creditBalance: number;
  totalCreditsPurchased: number;
  isOnboarded: boolean;
  deviceFingerprint: string | null;
  lastLoginAt: Date | null;
}

export interface UpdateUserData {
  fullName?: string;
  email?: string | null;
  phoneNumber?: string | null;
  passwordHash?: string;
  isActive?: boolean;
  isOnboarded?: boolean;
  lastLoginAt?: Date;
  creditBalance?: number;
}

export interface IUserRepository {
  save(data: SaveUserData): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByPhone(phone: string): Promise<User | null>;
  findAll(options?: {
    userType?: UserType | UserType[];
    excludeStudent?: boolean;
    onlyActive?: boolean;
  }): Promise<User[]>;
  update(id: string, data: UpdateUserData): Promise<User>;
  delete(id: string): Promise<void>;
  upsertExamPreference(userId: string, examId: string): Promise<void>;
}

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(data: SaveUserData): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        phoneNumber: data.phoneNumber,
        fullName: data.fullName,
        passwordHash: data.passwordHash,
        userType: data.userType,
        isActive: data.isActive,
        creditBalance: data.creditBalance,
        totalCreditsPurchased: data.totalCreditsPurchased,
        isOnboarded: data.isOnboarded,
        deviceFingerprint: data.deviceFingerprint,
        lastLoginAt: data.lastLoginAt,
      },
      include: {
        examPreferences: {
          where: { isPrimary: true },
          include: { exam: true },
        },
      },
    });

    return this.mapToEntity(user);
  }

  private mapToEntity(user: Record<string, unknown>): User {
    return new User({
      id: user.id as string,
      email: user.email as string | null,
      phoneNumber: user.phoneNumber as string | null,
      fullName: user.fullName as string,
      passwordHash: user.passwordHash as string | null,
      userType: user.userType as UserType,
      creditBalance: user.creditBalance as number,
      totalCreditsPurchased: user.totalCreditsPurchased as number,
      isActive: user.isActive as boolean,
      isOnboarded: user.isOnboarded as boolean,
      deviceFingerprint: user.deviceFingerprint as string | null,
      lastLoginAt: user.lastLoginAt as Date | null,
      createdAt: user.createdAt as Date,
      currentExam: (user.examPreferences as Array<{ exam: { id: string; examName: string } }>)?.[0]
        ?.exam
        ? {
            id: (user.examPreferences as Array<{ exam: { id: string; examName: string } }>)[0].exam
              .id,
            name: (user.examPreferences as Array<{ exam: { id: string; examName: string } }>)[0]
              .exam.examName,
          }
        : undefined,
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

    return this.mapToEntity(user);
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

    return this.mapToEntity(user);
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

    return this.mapToEntity(user);
  }

  async findAll(options?: {
    userType?: UserType | UserType[];
    excludeStudent?: boolean;
    onlyActive?: boolean;
  }): Promise<User[]> {
    const where: Record<string, unknown> = {};

    if (options?.userType || options?.excludeStudent || options?.onlyActive) {
      const conditions: Record<string, unknown>[] = [];

      if (options?.userType) {
        conditions.push({
          userType: Array.isArray(options.userType) ? { in: options.userType } : options.userType,
        });
      }

      if (options?.excludeStudent) {
        conditions.push({ userType: { not: UserType.student } });
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
      include: {
        examPreferences: {
          where: { isPrimary: true },
          include: { exam: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return users.map((user) => this.mapToEntity(user));
  }

  async update(id: string, data: UpdateUserData): Promise<User> {
    const updateData: Record<string, unknown> = {};

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
    if (data.creditBalance !== undefined) {
      updateData.creditBalance = data.creditBalance;
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        examPreferences: {
          where: { isPrimary: true },
          include: { exam: true },
        },
      },
    });

    return this.mapToEntity(user);
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
