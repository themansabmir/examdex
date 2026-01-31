import { Subject } from "./subject.entity";
import { PrismaClient } from "@prisma/client";

export interface ISubjectRepository {
  save(subject: Subject): Promise<Subject>;
  findById(id: string): Promise<Subject | null>;
  findByCode(code: string): Promise<Subject | null>;
  findAll(): Promise<Subject[]>;
  delete(id: string): Promise<void>;
}

export class PrismaSubjectRepository implements ISubjectRepository {
  private readonly db: any;

  constructor(private readonly prisma: PrismaClient) {
    this.db = prisma;
  }

  async save(subject: Subject): Promise<Subject> {
    const data = {
      id: subject.id,
      code: subject.code,
      name: subject.name,
      isActive: subject.isActive,
    };

    const saved = await this.db.subject.upsert({
      where: { id: subject.id },
      update: data,
      create: { ...data, examId: "system" },
    });

    return new Subject({
      id: saved.id,
      code: saved.code,
      name: saved.name,
      isActive: saved.isActive,
    });
  }

  async findById(id: string): Promise<Subject | null> {
    const subject = await this.db.subject.findUnique({ where: { id } });
    if (!subject) return null;
    return new Subject({
      id: subject.id,
      code: subject.code,
      name: subject.name,
      isActive: subject.isActive,
    });
  }

  async findByCode(code: string): Promise<Subject | null> {
    const subject = await this.db.subject.findUnique({ where: { code } });
    if (!subject) return null;
    return new Subject({
      id: subject.id,
      code: subject.code,
      name: subject.name,
      isActive: subject.isActive,
    });
  }

  async findAll(): Promise<Subject[]> {
    const subjects = await this.db.subject.findMany();
    return subjects.map(
      (s: any) =>
        new Subject({
          id: s.id,
          code: s.code,
          name: s.name,
          isActive: s.isActive,
        })
    );
  }

  async delete(id: string): Promise<void> {
    await this.db.subject.delete({ where: { id } });
  }
}
