import type { PrismaClient } from "@prisma/client";
import { UnauthorizedError } from "../../utils";
import { StudentOutputDTO, StudentOnboardInputDTO } from "./student.dto";

export interface IStudentRepository {
  onboarding(student: StudentOnboardInputDTO): Promise<StudentOutputDTO>;
}

export class PrismaStudentRepository implements IStudentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async onboarding(student: StudentOnboardInputDTO): Promise<StudentOutputDTO> {
    return await this.prisma.$transaction(async (tx) => {
      // 1. Get user
      if (!student.email) {
        throw new UnauthorizedError("User email is required");
      }

      const user = await tx.user.findUnique({
        where: { email: student.email },
      });

      if (!user) {
        throw new UnauthorizedError("User not found");
      }

      if (!user.isActive) {
        throw new UnauthorizedError("Account is inactive");
      }

      if (user.userType !== "student") {
        throw new UnauthorizedError("Only students can onboard");
      }

      // 2. Validate exam subject (required for subjectId + classId)
      const examSubject = await tx.examSubject.findFirst({
        where: {
          examId: student.examId,
        },
      });

      if (!examSubject) {
        throw new Error("Invalid exam or class configuration");
      }

      // 3. Upsert exam preference (atomic)
      await tx.userExamPreference.upsert({
        where: {
          userId_examId: {
            userId: user.id,
            examId: student.examId,
          },
        },
        update: {
          subjectId: examSubject.subjectId,
          classId: student.classId,
          isPrimary: true,
        },
        create: {
          userId: user.id,
          examId: student.examId,
          subjectId: examSubject.subjectId,
          classId: student.classId,
          isPrimary: true,
        },
      });

      // 4. Ensure only ONE primary preference
      await tx.userExamPreference.updateMany({
        where: {
          userId: user.id,
          examId: { not: student.examId },
        },
        data: {
          isPrimary: false,
        },
      });

      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          isOnboarded: true,
        },
        include: {
          examPreferences: {
            where: { isPrimary: true }, // only primary exam
            select: {
              examId: true,
              classId: true,
            },
          },
        },
      });

      const primaryPreference = updatedUser.examPreferences[0];
      return {
        ...updatedUser,
        examId: primaryPreference.examId,
        classId: primaryPreference.classId,
      } as StudentOutputDTO;
    });
  }
}
