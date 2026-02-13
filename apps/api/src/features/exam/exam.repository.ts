import type { PrismaClient } from "@prisma/client";
import { Exam } from "./exam.entity";

export interface IExamRepository {
  save(exam: Exam): Promise<Exam>;
  findById(id: string): Promise<Exam | null>;
  findByCode(examCode: string): Promise<Exam | null>;
  findAll(options?: { onlyActive?: boolean; onlyPopular?: boolean }): Promise<Exam[]>;
  findByUserId(userId: string): Promise<Exam[]>;
  update(id: string, data: Partial<Exam>): Promise<Exam>;
  delete(id: string): Promise<void>;
  saveMany(exams: Exam[]): Promise<void>;
}

export class PrismaExamRepository implements IExamRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(exam: Exam): Promise<Exam> {
    const savedExam = await this.prisma.exam.create({
      data: {
        id: exam.id,
        examCode: exam.examCode,
        examName: exam.examName,
        examFullName: exam.examFullName,
        examBoard: exam.examBoard,
        isActive: exam.isActive,
        isPopular: exam.isPopular,
      },
    });

    return new Exam({
      id: savedExam.id,
      examCode: savedExam.examCode,
      examName: savedExam.examName,
      examFullName: savedExam.examFullName,
      examBoard: savedExam.examBoard,
      isActive: savedExam.isActive,
      isPopular: savedExam.isPopular,
      createdAt: savedExam.createdAt,
      updatedAt: savedExam.updatedAt,
    });
  }

  async findById(id: string): Promise<Exam | null> {
    const exam = await this.prisma.exam.findUnique({
      where: { id },
    });

    if (!exam) return null;

    return new Exam({
      id: exam.id,
      examCode: exam.examCode,
      examName: exam.examName,
      examFullName: exam.examFullName,
      examBoard: exam.examBoard,
      isActive: exam.isActive,
      isPopular: exam.isPopular,
      createdAt: exam.createdAt,
      updatedAt: exam.updatedAt,
    });
  }

  async findByCode(examCode: string): Promise<Exam | null> {
    const exam = await this.prisma.exam.findUnique({
      where: { examCode },
    });

    if (!exam) return null;

    return new Exam({
      id: exam.id,
      examCode: exam.examCode,
      examName: exam.examName,
      examFullName: exam.examFullName,
      examBoard: exam.examBoard,
      isActive: exam.isActive,
      isPopular: exam.isPopular,
      createdAt: exam.createdAt,
      updatedAt: exam.updatedAt,
    });
  }

  async findAll(options?: { onlyActive?: boolean; onlyPopular?: boolean }): Promise<Exam[]> {
    const exams = await this.prisma.exam.findMany({
      where: {
        ...(options?.onlyActive && { isActive: true }),
        ...(options?.onlyPopular && { isPopular: true }),
      },
      orderBy: [{ isPopular: "desc" }, { examName: "asc" }],
    });

    return exams.map(
      (exam) =>
        new Exam({
          id: exam.id,
          examCode: exam.examCode,
          examName: exam.examName,
          examFullName: exam.examFullName,
          examBoard: exam.examBoard,
          isActive: exam.isActive,
          isPopular: exam.isPopular,
          createdAt: exam.createdAt,
          updatedAt: exam.updatedAt,
        })
    );
  }

  async update(id: string, data: Partial<Exam>): Promise<Exam> {
    const updatedExam = await this.prisma.exam.update({
      where: { id },
      data: {
        ...(data.examName && { examName: data.examName }),
        ...(data.examFullName !== undefined && { examFullName: data.examFullName }),
        ...(data.examBoard !== undefined && { examBoard: data.examBoard }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.isPopular !== undefined && { isPopular: data.isPopular }),
      },
    });

    return new Exam({
      id: updatedExam.id,
      examCode: updatedExam.examCode,
      examName: updatedExam.examName,
      examFullName: updatedExam.examFullName,
      examBoard: updatedExam.examBoard,
      isActive: updatedExam.isActive,
      isPopular: updatedExam.isPopular,
      createdAt: updatedExam.createdAt,
      updatedAt: updatedExam.updatedAt,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.exam.delete({
      where: { id },
    });
  }
  async findByUserId(userId: string): Promise<Exam[]> {
    const exams = await this.prisma.exam.findMany({
      where: {
        userExamPreferences: {
          some: {
            userId,
          },
        },
      },
    });
    return exams.map(
      (exam) =>
        new Exam({
          id: exam.id,
          examCode: exam.examCode,
          examName: exam.examName,
          examFullName: exam.examFullName,
          examBoard: exam.examBoard,
          isActive: exam.isActive,
          isPopular: exam.isPopular,
          createdAt: exam.createdAt,
          updatedAt: exam.updatedAt,
        })
    );
  }

  async saveMany(exams: Exam[]): Promise<void> {
    await this.prisma.exam.createMany({
      data: exams.map((exam) => ({
        id: exam.id,
        examCode: exam.examCode,
        examName: exam.examName,
        examFullName: exam.examFullName,
        examBoard: exam.examBoard,
        isActive: exam.isActive,
        isPopular: exam.isPopular,
        createdAt: exam.createdAt,
        updatedAt: exam.updatedAt,
      })),
      skipDuplicates: true,
    });
  }
}
