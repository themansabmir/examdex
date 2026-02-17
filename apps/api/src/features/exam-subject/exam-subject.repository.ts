import type { PrismaClient } from "@prisma/client";
import { ExamSubject } from "./exam-subject.entity";

export interface IExamSubjectRepository {
  save(examSubject: ExamSubject): Promise<ExamSubject>;
  saveMany(examSubjects: ExamSubject[]): Promise<void>;
  findById(id: string): Promise<ExamSubject | null>;
  findByExamAndSubject(examId: string, subjectId: string): Promise<ExamSubject | null>;
  findByExamId(examId: string, options?: { onlyActive?: boolean }): Promise<ExamSubject[]>;
  findBySubjectId(subjectId: string, options?: { onlyActive?: boolean }): Promise<ExamSubject[]>;
  findAll(options?: { onlyActive?: boolean }): Promise<ExamSubject[]>;
  update(id: string, data: Partial<ExamSubject>): Promise<ExamSubject>;
  delete(id: string): Promise<void>;
}

export class PrismaExamSubjectRepository implements IExamSubjectRepository {
  constructor(private readonly prisma: PrismaClient) { }

  async save(examSubject: ExamSubject): Promise<ExamSubject> {
    const saved = await this.prisma.examSubject.create({
      data: {
        id: examSubject.id,
        examId: examSubject.examId,
        subjectId: examSubject.subjectId,
        displayOrder: examSubject.displayOrder,
        isActive: examSubject.isActive,
      },
    });

    return new ExamSubject({
      id: saved.id,
      examId: saved.examId,
      subjectId: saved.subjectId,
      displayOrder: saved.displayOrder,
      isActive: saved.isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async saveMany(examSubjects: ExamSubject[]): Promise<void> {
    await this.prisma.examSubject.createMany({
      data: examSubjects.map((es) => ({
        id: es.id,
        examId: es.examId,
        subjectId: es.subjectId,
        displayOrder: es.displayOrder,
        isActive: es.isActive,
      })),
    });
  }

  async findById(id: string): Promise<ExamSubject | null> {
    const examSubject = await this.prisma.examSubject.findUnique({
      where: { id },
      include: {
        subject: {
          select: {
            id: true,
            subjectCode: true,
            subjectName: true,
          },
        },
        exam: {
          select: {
            id: true,
            examCode: true,
            examName: true,
          },
        },
      },
    });

    if (!examSubject) return null;

    return new ExamSubject({
      id: examSubject.id,
      examId: examSubject.examId,
      subjectId: examSubject.subjectId,
      displayOrder: examSubject.displayOrder,
      isActive: examSubject.isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
      subject: examSubject.subject,
      exam: examSubject.exam,
    });
  }

  async findByExamAndSubject(examId: string, subjectId: string): Promise<ExamSubject | null> {
    const examSubject = await this.prisma.examSubject.findUnique({
      where: {
        examId_subjectId: { examId, subjectId },
      },
    });

    if (!examSubject) return null;

    return new ExamSubject({
      id: examSubject.id,
      examId: examSubject.examId,
      subjectId: examSubject.subjectId,
      displayOrder: examSubject.displayOrder,
      isActive: examSubject.isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async findByExamId(examId: string, options?: { onlyActive?: boolean }): Promise<ExamSubject[]> {
    const examSubjects = await this.prisma.examSubject.findMany({
      where: {
        examId,
        ...(options?.onlyActive && { isActive: true }),
      },
      include: {
        subject: {
          select: {
            id: true,
            subjectCode: true,
            subjectName: true,
          },
        },
      },
      orderBy: [{ displayOrder: "asc" }, { subjectId: "asc" }],
    });

    return examSubjects.map(
      (es) =>
        new ExamSubject({
          id: es.id,
          examId: es.examId,
          subjectId: es.subjectId,
          displayOrder: es.displayOrder,
          isActive: es.isActive,
          createdAt: new Date(),
          updatedAt: new Date(),
          subject: es.subject,
        })
    );
  }

  async findBySubjectId(
    subjectId: string,
    options?: { onlyActive?: boolean }
  ): Promise<ExamSubject[]> {
    const examSubjects = await this.prisma.examSubject.findMany({
      where: {
        subjectId,
        ...(options?.onlyActive && { isActive: true }),
      },
      include: {
        exam: {
          select: {
            id: true,
            examCode: true,
            examName: true,
          },
        },
      },
      orderBy: { displayOrder: "asc" },
    });

    return examSubjects.map(
      (es) =>
        new ExamSubject({
          id: es.id,
          examId: es.examId,
          subjectId: es.subjectId,
          displayOrder: es.displayOrder,
          isActive: es.isActive,
          createdAt: new Date(),
          updatedAt: new Date(),
          exam: es.exam,
        })
    );
  }

  async findAll(options?: { onlyActive?: boolean }): Promise<ExamSubject[]> {
    const examSubjects = await this.prisma.examSubject.findMany({
      where: {
        ...(options?.onlyActive && { isActive: true }),
      },
      include: {
        subject: {
          select: {
            id: true,
            subjectCode: true,
            subjectName: true,
          },
        },
        exam: {
          select: {
            id: true,
            examCode: true,
            examName: true,
          },
        },
      },
      orderBy: [{ displayOrder: "asc" }, { subjectId: "asc" }],
    });

    return examSubjects.map(
      (es) =>
        new ExamSubject({
          id: es.id,
          examId: es.examId,
          subjectId: es.subjectId,
          displayOrder: es.displayOrder,
          isActive: es.isActive,
          createdAt: new Date(),
          updatedAt: new Date(),
          subject: es.subject,
          exam: es.exam,
        })
    );
  }

  async update(id: string, data: Partial<ExamSubject>): Promise<ExamSubject> {
    const updated = await this.prisma.examSubject.update({
      where: { id },
      data: {
        ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });

    return new ExamSubject({
      id: updated.id,
      examId: updated.examId,
      subjectId: updated.subjectId,
      displayOrder: updated.displayOrder,
      isActive: updated.isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.examSubject.delete({
      where: { id },
    });
  }
}
