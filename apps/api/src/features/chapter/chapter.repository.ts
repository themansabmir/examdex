import type { PrismaClient } from "@prisma/client";
import { Chapter } from "./chapter.entity";

export interface IChapterRepository {
  save(chapter: Chapter): Promise<Chapter>;
  findById(id: string): Promise<Chapter | null>;
  findByIds(ids: string[]): Promise<Chapter[]>;
  findBySubjectAndCode(subjectId: string, chapterCode: string): Promise<Chapter | null>;
  findAll(options?: {
    onlyActive?: boolean;
    subjectId?: string;
    classId?: string;
  }): Promise<Chapter[]>;
  update(id: string, data: Partial<Chapter>): Promise<Chapter>;
  delete(id: string): Promise<void>;
  saveMany(chapters: Chapter[]): Promise<void>;
}

export class PrismaChapterRepository implements IChapterRepository {
  constructor(private readonly prisma: PrismaClient) { }

  async save(chapter: Chapter): Promise<Chapter> {
    const savedChapter = await this.prisma.chapter.create({
      data: {
        id: chapter.id,
        subjectId: chapter.subjectId,
        chapterCode: chapter.chapterCode,
        chapterName: chapter.chapterName,
        classId: chapter.classId,
        isActive: chapter.isActive,
      },
    });

    return new Chapter({
      id: savedChapter.id,
      subjectId: savedChapter.subjectId,
      chapterCode: savedChapter.chapterCode,
      chapterName: savedChapter.chapterName,
      classId: savedChapter.classId,
      isActive: savedChapter.isActive,
    });
  }

  async findById(id: string): Promise<Chapter | null> {
    const chapter = await this.prisma.chapter.findUnique({
      where: { id },
    });

    if (!chapter) return null;

    return new Chapter({
      id: chapter.id,
      subjectId: chapter.subjectId,
      chapterCode: chapter.chapterCode,
      chapterName: chapter.chapterName,
      classId: chapter.classId,
      isActive: chapter.isActive,
    });
  }

  async findByIds(ids: string[]): Promise<Chapter[]> {
    const chapters = await this.prisma.chapter.findMany({
      where: { id: { in: ids } },
    });

    return chapters.map(
      (chapter) =>
        new Chapter({
          id: chapter.id,
          subjectId: chapter.subjectId,
          chapterCode: chapter.chapterCode,
          chapterName: chapter.chapterName,
          classId: chapter.classId,
          isActive: chapter.isActive,
        })
    );
  }

  async findBySubjectAndCode(subjectId: string, chapterCode: string): Promise<Chapter | null> {
    const chapter = await this.prisma.chapter.findUnique({
      where: {
        subjectId_chapterCode: {
          subjectId,
          chapterCode,
        },
      },
    });

    if (!chapter) return null;

    return new Chapter({
      id: chapter.id,
      subjectId: chapter.subjectId,
      chapterCode: chapter.chapterCode,
      chapterName: chapter.chapterName,
      classId: chapter.classId,
      isActive: chapter.isActive,
    });
  }

  async findAll(options?: {
    onlyActive?: boolean;
    subjectId?: string;
    classId?: string;
  }): Promise<Chapter[]> {
    const chapters = await this.prisma.chapter.findMany({
      where: {
        ...(options?.onlyActive && { isActive: true }),
        ...(options?.subjectId && { subjectId: options.subjectId }),
        ...(options?.classId && { classId: options.classId }),
      },
      orderBy: { chapterName: "asc" },
    });

    return chapters.map(
      (chapter) =>
        new Chapter({
          id: chapter.id,
          subjectId: chapter.subjectId,
          chapterCode: chapter.chapterCode,
          chapterName: chapter.chapterName,
          classId: chapter.classId,
          isActive: chapter.isActive,
        })
    );
  }

  async update(id: string, data: Partial<Chapter>): Promise<Chapter> {
    const updatedChapter = await this.prisma.chapter.update({
      where: { id },
      data: {
        ...(data.chapterName && { chapterName: data.chapterName }),
        ...(data.classId !== undefined && { classId: data.classId }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });

    return new Chapter({
      id: updatedChapter.id,
      subjectId: updatedChapter.subjectId,
      chapterCode: updatedChapter.chapterCode,
      chapterName: updatedChapter.chapterName,
      classId: updatedChapter.classId,
      isActive: updatedChapter.isActive,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.chapter.delete({
      where: { id },
    });
  }

  async saveMany(chapters: Chapter[]): Promise<void> {
    await this.prisma.chapter.createMany({
      data: chapters.map((chapter) => ({
        id: chapter.id,
        subjectId: chapter.subjectId,
        chapterCode: chapter.chapterCode,
        chapterName: chapter.chapterName,
        classId: chapter.classId,
        isActive: chapter.isActive,
      })),
      skipDuplicates: true,
    });
  }
}
