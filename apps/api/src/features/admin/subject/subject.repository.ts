import { Subject } from "./subject.entity";

export interface ISubjectRepository {
  save(subject: Subject): Promise<Subject>;
  findById(id: string): Promise<Subject | null>;
  findByCode(code: string): Promise<Subject | null>;
  findAll(): Promise<Subject[]>;
  delete(id: string): Promise<void>;
}

export class InMemorySubjectRepository implements ISubjectRepository {
  private subjects = new Map<string, Subject>();

  async save(subject: Subject): Promise<Subject> {
    this.subjects.set(subject.id, subject);
    return subject;
  }

  async findById(id: string): Promise<Subject | null> {
    return this.subjects.get(id) ?? null;
  }

  async findByCode(code: string): Promise<Subject | null> {
    return Array.from(this.subjects.values()).find((s) => s.code === code) ?? null;
  }

  async findAll(): Promise<Subject[]> {
    return Array.from(this.subjects.values());
  }

  async delete(id: string): Promise<void> {
    this.subjects.delete(id);
  }
}
