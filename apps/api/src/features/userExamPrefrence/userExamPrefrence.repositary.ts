import { PrismaClient } from "@prisma/client";
import { UserExamPreference } from "./userExamPrefrence.entity";

export interface IUserExamRepositary {
  findPrimaryById(userId: string): Promise<UserExamPreference | null>;
}

export class PrismaUserExamReposiary implements IUserExamRepositary {
  constructor(private readonly prisma: PrismaClient) {}

  async findPrimaryById(userId: string): Promise<UserExamPreference | null> {
    const preference = await this.prisma.userExamPreference.findFirst({
      where: {
        userId,
        isPrimary: true,
      },
    });

    if (!preference) return null;

    return new UserExamPreference({
      id: preference.id,

      userId: preference.userId,
      examId: preference.examId,
      subjectId: preference.subjectId,

      isPrimary: preference.isPrimary,

      targetExamDate: preference.targetExamDate ?? null,

      createdAt: preference.createdAt,
    });
  }
}
