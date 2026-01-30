import { Exam } from "./exam.entity";
import { PrismaClient } from "@prisma/client";

export interface IExamRepository {
  save(exam: Exam): Promise<Exam>;
  findById(id: string): Promise<Exam | null>;
  findByCode(code: string): Promise<Exam | null>;
  findAll(): Promise<Exam[]>;
  findByUserId(userId: string): Promise<Exam[]>;
  delete(id: string): Promise<void>;
}

export class InMemoryExamRepository implements IExamRepository {
  private exams = new Map<string, Exam>();

  async save(exam: Exam): Promise<Exam> {
    this.exams.set(exam.id, exam);
    return exam;
  }

  async findById(id: string): Promise<Exam | null> {
    return this.exams.get(id) ?? null;
  }

  async findByCode(code: string): Promise<Exam | null> {
    return Array.from(this.exams.values()).find((e) => e.code === code) ?? null;
  }

  async findAll(): Promise<Exam[]> {
    return Array.from(this.exams.values());
  }

  async findByUserId(_userId: string): Promise<Exam[]> {
    // Simple in-memory filter, implementation depends on how user-exam relation is stored
    // For now returning empty or we'd need a field on Exam entity
    return Array.from(this.exams.values());
  }

  async delete(id: string): Promise<void> {
    this.exams.delete(id);
  }
}

export class PrismaExamRepository implements IExamRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(exam: Exam): Promise<Exam> {
    const data = {
      id: exam.id,
      title: exam.name, // Mapping 'name' to 'title' in DB
      description: exam.category,
      status: exam.isActive ? "active" : "draft",
    };

    const saved = await this.prisma.exam.upsert({
      where: { id: exam.id },
      update: data,
      create: { ...data, userId: "system" }, // Default userId for now
    });

    return new Exam({
      id: saved.id,
      code: saved.id,
      name: saved.title,
      category: saved.description || "",
      isActive: saved.status === "active",
    });
  }

  async findById(id: string): Promise<Exam | null> {
    const exam = await this.prisma.exam.findUnique({ where: { id } });
    if (!exam) return null;
    return new Exam({
      id: exam.id,
      code: exam.id,
      name: exam.title,
      category: exam.description || "",
      isActive: exam.status === "active",
    });
  }

  async findByCode(code: string): Promise<Exam | null> {
    // DB uses id, matching code to id for now
    return this.findById(code);
  }

  async findAll(): Promise<Exam[]> {
    const exams = await this.prisma.exam.findMany();
    return exams.map(
      (exam) =>
        new Exam({
          id: exam.id,
          code: exam.id,
          name: exam.title,
          category: exam.description || "",
          isActive: exam.status === "active",
        })
    );
  }

  async findByUserId(userId: string): Promise<Exam[]> {
    const exams = await this.prisma.exam.findMany({ where: { userId } });
    return exams.map(
      (exam) =>
        new Exam({
          id: exam.id,
          code: exam.id,
          name: exam.title,
          category: exam.description || "",
          isActive: exam.status === "active",
        })
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.exam.delete({ where: { id } });
  }
}
