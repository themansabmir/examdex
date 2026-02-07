import type { PrismaClient } from "@prisma/client";
import { Class } from "./class.entity";

export interface IClassRepository {
  save(classEntity: Class): Promise<Class>;
  findById(id: string): Promise<Class | null>;
  findByCode(classCode: string): Promise<Class | null>;
  findAll(options?: { onlyActive?: boolean }): Promise<Class[]>;
  update(id: string, data: Partial<Class>): Promise<Class>;
  delete(id: string): Promise<void>;
}

export class PrismaClassRepository implements IClassRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(classEntity: Class): Promise<Class> {
    const saved = await this.prisma.class.create({
      data: {
        id: classEntity.id,
        classCode: classEntity.classCode,
        className: classEntity.className,
        isActive: classEntity.isActive,
      },
    });

    return new Class({
      id: saved.id,
      classCode: saved.classCode,
      className: saved.className,
      displayOrder: null,
      isActive: saved.isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async findById(id: string): Promise<Class | null> {
    const cls = await this.prisma.class.findUnique({
      where: { id },
    });

    if (!cls) return null;

    return new Class({
      id: cls.id,
      classCode: cls.classCode,
      className: cls.className,
      displayOrder: null,
      isActive: cls.isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async findByCode(classCode: string): Promise<Class | null> {
    const cls = await this.prisma.class.findUnique({
      where: { classCode },
    });

    if (!cls) return null;

    return new Class({
      id: cls.id,
      classCode: cls.classCode,
      className: cls.className,
      displayOrder: null,
      isActive: cls.isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async findAll(options?: { onlyActive?: boolean }): Promise<Class[]> {
    const classes = await this.prisma.class.findMany({
      where: {
        ...(options?.onlyActive && { isActive: true }),
      },
      orderBy: [{ classCode: "asc" }],
    });

    return classes.map(
      (cls) =>
        new Class({
          id: cls.id,
          classCode: cls.classCode,
          className: cls.className,
          displayOrder: null,
          isActive: cls.isActive,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
    );
  }

  async update(id: string, data: Partial<Class>): Promise<Class> {
    const updated = await this.prisma.class.update({
      where: { id },
      data: {
        ...(data.className !== undefined && { className: data.className }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });

    return new Class({
      id: updated.id,
      classCode: updated.classCode,
      className: updated.className,
      displayOrder: null,
      isActive: updated.isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.class.delete({
      where: { id },
    });
  }
}
