import type { PrismaClient } from "@prisma/client";
import { Exam, type ExamStatus } from "./exam.entity";

export interface IExamRepository {
  save(exam: Exam): Promise<Exam>;
  findById(id: string): Promise<Exam | null>;
  findByUserId(userId: string): Promise<Exam[]>;
  findAll(): Promise<Exam[]>;
  delete(id: string): Promise<void>;
}

export class PrismaExamRepository implements IExamRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(exam: Exam): Promise<Exam> {
    const savedExam = await this.prisma.exam.upsert({
      where: { id: exam.id },
      update: {
        title: exam.title,
        description: exam.description,
        status: exam.status,
        duration: exam.duration,
        passingScore: exam.passingScore,
      },
      create: {
        id: exam.id,
        title: exam.title,
        description: exam.description,
        userId: exam.userId,
        status: exam.status,
        duration: exam.duration,
        passingScore: exam.passingScore,
      },
    });

    return new Exam({
      id: savedExam.id,
      title: savedExam.title,
      description: savedExam.description,
      userId: savedExam.userId,
      status: savedExam.status as ExamStatus,
      duration: savedExam.duration,
      passingScore: savedExam.passingScore,
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
      title: exam.title,
      description: exam.description,
      userId: exam.userId,
      status: exam.status as ExamStatus,
      duration: exam.duration,
      passingScore: exam.passingScore,
      createdAt: exam.createdAt,
      updatedAt: exam.updatedAt,
    });
  }

  async findByUserId(userId: string): Promise<Exam[]> {
    const exams = await this.prisma.exam.findMany({
      where: { userId },
    });

    return exams.map(
      (exam) =>
        new Exam({
          id: exam.id,
          title: exam.title,
          description: exam.description,
          userId: exam.userId,
          status: exam.status as ExamStatus,
          duration: exam.duration,
          passingScore: exam.passingScore,
          createdAt: exam.createdAt,
          updatedAt: exam.updatedAt,
        })
    );
  }

  async findAll(): Promise<Exam[]> {
    const exams = await this.prisma.exam.findMany();

    return exams.map(
      (exam) =>
        new Exam({
          id: exam.id,
          title: exam.title,
          description: exam.description,
          userId: exam.userId,
          status: exam.status as ExamStatus,
          duration: exam.duration,
          passingScore: exam.passingScore,
          createdAt: exam.createdAt,
          updatedAt: exam.updatedAt,
        })
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.exam.delete({
      where: { id },
    });
  }
}

export class InMemoryExamRepository implements IExamRepository {
  private exams: Map<string, Exam> = new Map();

  async save(exam: Exam): Promise<Exam> {
    this.exams.set(exam.id, exam);
    return exam;
  }

  async findById(id: string): Promise<Exam | null> {
    return this.exams.get(id) ?? null;
  }

  async findByUserId(userId: string): Promise<Exam[]> {
    const result: Exam[] = [];
    for (const exam of this.exams.values()) {
      if (exam.userId === userId) {
        result.push(exam);
      }
    }
    return result;
  }

  async findAll(): Promise<Exam[]> {
    return Array.from(this.exams.values());
  }

  async delete(id: string): Promise<void> {
    this.exams.delete(id);
  }
}
