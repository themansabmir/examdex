import { PrismaClient } from "@prisma/client";
import { ExamConfig } from "./examConfig.entity";

export interface IExamConfigRepository {
  save(examConfig: ExamConfig): Promise<ExamConfig>;
  findById(id: string): Promise<ExamConfig | null>;
  update(id: string, data: Partial<ExamConfig>): Promise<ExamConfig>;
  delete(id: string): Promise<void>;
  findAll(skip: number, limit: number, search: string): Promise<ExamConfig[]>;
  findByExamSubjectId(id: string): Promise<ExamConfig>;
}

export class PrismaExamConfigRepository implements IExamConfigRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(examConfig: ExamConfig): Promise<ExamConfig> {
    return await this.prisma.examConfig.create({
      data: {
        examSubjectId: examConfig.examSubjectId,
        questionTypeId: examConfig.questionTypeId,
        questionCount: examConfig.questionCount,
        marksPerQuestion: examConfig.marksPerQuestion,
        negativeMarks: examConfig.negativeMarks,
        displayOrder: examConfig.displayOrder,
        difficultyMixJson: examConfig.difficultyMixJson,
      },
      include: {
        examSubject: {
          include: {
            exam: true,
            subject: true,
          },
        },
        questionType: true,
      },
    });
  }

  async findById(id: string): Promise<ExamConfig | null> {
    return await this.prisma.examConfig.findUnique({
      where: { id },
      include: {
        examSubject: {
          include: {
            exam: true,
            subject: true,
          },
        },
        questionType: true,
      },
    });
  }

  async update(id: string, data: Partial<ExamConfig>): Promise<ExamConfig> {
    return await this.prisma.examConfig.update({
      where: { id },
      data,
      include: {
        examSubject: {
          include: {
            exam: true,
            subject: true,
          },
        },
        questionType: true,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.examConfig.delete({
      where: { id },
    });
  }

  async findAll(skip: number, limit: number, search: string): Promise<ExamConfig[]> {
    return await this.prisma.examConfig.findMany({
      skip,
      take: limit,
      where: {
        OR: [
          {
            questionType: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
          {
            examSubject: {
              exam: {
                examName: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
          },
          {
            examSubject: {
              subject: {
                subjectName: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
          },
        ],
      },
      include: {
        examSubject: {
          include: {
            exam: true,
            subject: true,
          },
        },
        questionType: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
  async findByExamSubjectId(examSubjectId: string): Promise<ExamConfig> {
    const examSubject = await this.prisma.examConfig.findFirst({
      where: {
        examSubjectId,
      },
    });
    return new ExamConfig({
      id: examSubject!.id,

      examSubjectId: examSubject!.examSubjectId,
      questionTypeId: examSubject!.questionTypeId,

      questionCount: examSubject!.questionCount,

      marksPerQuestion: examSubject!.marksPerQuestion,
      negativeMarks: examSubject!.negativeMarks,

      displayOrder: examSubject!.displayOrder,

      difficultyMixJson: examSubject!.difficultyMixJson,

      createdAt: examSubject!.createdAt,
      updatedAt: examSubject!.updatedAt,
    });
  }
}
