import type { PrismaClient } from "@prisma/client";
import { SubjectChapter } from "./subject-chapter.entity";

export interface ISubjectChapterRepository {
  save(subjectChapter: SubjectChapter): Promise<SubjectChapter>;
  saveMany(subjectChapters: SubjectChapter[]): Promise<void>;
  findById(id: string): Promise<SubjectChapter | null>;
  findByExamSubjectAndChapter(
    examSubjectId: string,
    chapterId: string
  ): Promise<SubjectChapter | null>;
  findByExamSubjectId(
    examSubjectId: string,
    options?: { onlyActive?: boolean }
  ): Promise<SubjectChapter[]>;
  findByChapterId(
    chapterId: string,
    options?: { onlyActive?: boolean }
  ): Promise<SubjectChapter[]>;
  findAll(options?: { onlyActive?: boolean }): Promise<SubjectChapter[]>;
  update(id: string, data: Partial<SubjectChapter>): Promise<SubjectChapter>;
  delete(id: string): Promise<void>;
}

export class PrismaSubjectChapterRepository implements ISubjectChapterRepository {
  constructor(private readonly prisma: PrismaClient) { }

  async save(subjectChapter: SubjectChapter): Promise<SubjectChapter> {
    const saved = await this.prisma.subjectChapter.create({
      data: {
        id: subjectChapter.id,
        examSubjectId: subjectChapter.examSubjectId,
        chapterId: subjectChapter.chapterId,
        chapterNumber: subjectChapter.chapterNumber,
        weightagePercentage: subjectChapter.weightagePercentage,
        isActive: subjectChapter.isActive,
      },
    });

    return new SubjectChapter({
      id: saved.id,
      examSubjectId: saved.examSubjectId,
      chapterId: saved.chapterId,
      chapterNumber: saved.chapterNumber,
      weightagePercentage: Number(saved.weightagePercentage),
      isActive: saved.isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async saveMany(subjectChapters: SubjectChapter[]): Promise<void> {
    await this.prisma.subjectChapter.createMany({
      data: subjectChapters.map((sc) => ({
        id: sc.id,
        examSubjectId: sc.examSubjectId,
        chapterId: sc.chapterId,
        chapterNumber: sc.chapterNumber,
        weightagePercentage: sc.weightagePercentage,
        isActive: sc.isActive,
      })),
    });
  }

  async findById(id: string): Promise<SubjectChapter | null> {
    const sc = await this.prisma.subjectChapter.findUnique({
      where: { id },
    });

    if (!sc) return null;

    return new SubjectChapter({
      id: sc.id,
      examSubjectId: sc.examSubjectId,
      chapterId: sc.chapterId,
      chapterNumber: sc.chapterNumber,
      weightagePercentage: Number(sc.weightagePercentage),
      isActive: sc.isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async findByExamSubjectAndChapter(
    examSubjectId: string,
    chapterId: string
  ): Promise<SubjectChapter | null> {
    const sc = await this.prisma.subjectChapter.findUnique({
      where: {
        examSubjectId_chapterId: { examSubjectId, chapterId },
      },
    });

    if (!sc) return null;

    return new SubjectChapter({
      id: sc.id,
      examSubjectId: sc.examSubjectId,
      chapterId: sc.chapterId,
      chapterNumber: sc.chapterNumber,
      weightagePercentage: Number(sc.weightagePercentage),
      isActive: sc.isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async findByExamSubjectId(
    examSubjectId: string,
    options?: { onlyActive?: boolean }
  ): Promise<SubjectChapter[]> {
    const chapters = await this.prisma.subjectChapter.findMany({
      where: {
        examSubjectId,
        ...(options?.onlyActive && { isActive: true }),
      },
      orderBy: [{ chapterNumber: "asc" }, { chapterId: "asc" }],
    });

    return chapters.map(
      (sc) =>
        new SubjectChapter({
          id: sc.id,
          examSubjectId: sc.examSubjectId,
          chapterId: sc.chapterId,
          chapterNumber: sc.chapterNumber,
          weightagePercentage: Number(sc.weightagePercentage),
          isActive: sc.isActive,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
    );
  }

  async findByChapterId(
    chapterId: string,
    options?: { onlyActive?: boolean }
  ): Promise<SubjectChapter[]> {
    const chapters = await this.prisma.subjectChapter.findMany({
      where: {
        chapterId,
        ...(options?.onlyActive && { isActive: true }),
      },
      orderBy: { weightagePercentage: "desc" },
    });

    return chapters.map(
      (sc) =>
        new SubjectChapter({
          id: sc.id,
          examSubjectId: sc.examSubjectId,
          chapterId: sc.chapterId,
          chapterNumber: sc.chapterNumber,
          weightagePercentage: Number(sc.weightagePercentage),
          isActive: sc.isActive,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
    );
  }

  async findAll(options?: { onlyActive?: boolean }): Promise<SubjectChapter[]> {
    const chapters = await this.prisma.subjectChapter.findMany({
      where: {
        ...(options?.onlyActive && { isActive: true }),
      },
      orderBy: [{ chapterNumber: "asc" }, { chapterId: "asc" }],
    });

    return chapters.map(
      (sc) =>
        new SubjectChapter({
          id: sc.id,
          examSubjectId: sc.examSubjectId,
          chapterId: sc.chapterId,
          chapterNumber: sc.chapterNumber,
          weightagePercentage: Number(sc.weightagePercentage),
          isActive: sc.isActive,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
    );
  }

  async update(id: string, data: Partial<SubjectChapter>): Promise<SubjectChapter> {
    const updated = await this.prisma.subjectChapter.update({
      where: { id },
      data: {
        ...(data.chapterNumber !== undefined && { chapterNumber: data.chapterNumber }),
        ...(data.weightagePercentage !== undefined && {
          weightagePercentage: data.weightagePercentage,
        }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });

    return new SubjectChapter({
      id: updated.id,
      examSubjectId: updated.examSubjectId,
      chapterId: updated.chapterId,
      chapterNumber: updated.chapterNumber,
      weightagePercentage: Number(updated.weightagePercentage),
      isActive: updated.isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.subjectChapter.delete({
      where: { id },
    });
  }
}
