import type { PrismaClient } from "@prisma/client";
import { Subject } from "./subject.entity";

export interface ISubjectRepository {
  save(subject: Subject): Promise<Subject>;
  findById(id: string): Promise<Subject | null>;
  findByCode(subjectCode: string): Promise<Subject | null>;
  findAll(options?: { onlyActive?: boolean }): Promise<Subject[]>;
  update(id: string, data: Partial<Subject>): Promise<Subject>;
  delete(id: string): Promise<void>;
}

export class PrismaSubjectRepository implements ISubjectRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(subject: Subject): Promise<Subject> {
    const savedSubject = await this.prisma.subject.create({
      data: {
        id: subject.id,
        subjectCode: subject.subjectCode,
        subjectName: subject.subjectName,
        isActive: subject.isActive,
      },
    });

    return new Subject({
      id: savedSubject.id,
      subjectCode: savedSubject.subjectCode,
      subjectName: savedSubject.subjectName,
      isActive: savedSubject.isActive,
    });
  }

  async findById(id: string): Promise<Subject | null> {
    const subject = await this.prisma.subject.findUnique({
      where: { id },
    });

    if (!subject) return null;

    return new Subject({
      id: subject.id,
      subjectCode: subject.subjectCode,
      subjectName: subject.subjectName,
      isActive: subject.isActive,
    });
  }

  async findByCode(subjectCode: string): Promise<Subject | null> {
    const subject = await this.prisma.subject.findUnique({
      where: { subjectCode },
    });

    if (!subject) return null;

    return new Subject({
      id: subject.id,
      subjectCode: subject.subjectCode,
      subjectName: subject.subjectName,
      isActive: subject.isActive,
    });
  }

  async findAll(options?: { onlyActive?: boolean }): Promise<Subject[]> {
    const subjects = await this.prisma.subject.findMany({
      where: {
        ...(options?.onlyActive && { isActive: true }),
      },
      orderBy: { subjectName: "asc" },
    });

    return subjects.map(
      (subject) =>
        new Subject({
          id: subject.id,
          subjectCode: subject.subjectCode,
          subjectName: subject.subjectName,
          isActive: subject.isActive,
        })
    );
  }

  async update(id: string, data: Partial<Subject>): Promise<Subject> {
    const updatedSubject = await this.prisma.subject.update({
      where: { id },
      data: {
        ...(data.subjectName && { subjectName: data.subjectName }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });

    return new Subject({
      id: updatedSubject.id,
      subjectCode: updatedSubject.subjectCode,
      subjectName: updatedSubject.subjectName,
      isActive: updatedSubject.isActive,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.subject.delete({
      where: { id },
    });
  }
}
