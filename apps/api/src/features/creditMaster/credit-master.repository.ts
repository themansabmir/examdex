import type { PrismaClient } from "@prisma/client";
import { CreditMaster } from "./credit-master.entity";

export interface ICreditMasterRepository {
  save(creditMaster: CreditMaster): Promise<CreditMaster>;
  findById(id: string): Promise<CreditMaster | null>;
  findAll(): Promise<CreditMaster[]>;
  update(id: string, data: Partial<CreditMaster>): Promise<CreditMaster>;
  delete(id: string): Promise<void>;
  findActive(): Promise<CreditMaster | null>;
  deactivateAll(): Promise<void>;
}

export class PrismaCreditMasterRepository implements ICreditMasterRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(creditMaster: CreditMaster): Promise<CreditMaster> {
    const saved = await this.prisma.defaultCreditConfig.create({
      data: {
        id: creditMaster.id,
        creditsPerNewStudent: creditMaster.creditsPerNewStudent,
        description: creditMaster.description,
        isActive: creditMaster.isActive,
        updatedById: creditMaster.updatedById,
      },
    });

    return this.mapToEntity(saved);
  }

  async findById(id: string): Promise<CreditMaster | null> {
    const found = await this.prisma.defaultCreditConfig.findUnique({
      where: { id },
    });

    if (!found) return null;

    return this.mapToEntity(found);
  }

  async findAll(): Promise<CreditMaster[]> {
    const configs = await this.prisma.defaultCreditConfig.findMany({
      orderBy: { createdAt: "desc" },
    });

    return configs.map((config) => this.mapToEntity(config));
  }

  async update(id: string, data: Partial<CreditMaster>): Promise<CreditMaster> {
    const updated = await this.prisma.defaultCreditConfig.update({
      where: { id },
      data: {
        ...(data.creditsPerNewStudent !== undefined && {
          creditsPerNewStudent: data.creditsPerNewStudent,
        }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.updatedById !== undefined && { updatedById: data.updatedById }),
      },
    });

    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.defaultCreditConfig.delete({
      where: { id },
    });
  }

  async findActive(): Promise<CreditMaster | null> {
    const active = await this.prisma.defaultCreditConfig.findFirst({
      where: { isActive: true },
    });

    if (!active) return null;

    return this.mapToEntity(active);
  }

  async deactivateAll(): Promise<void> {
    await this.prisma.defaultCreditConfig.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });
  }

  private mapToEntity(data: any): CreditMaster {
    return new CreditMaster({
      id: data.id,
      creditsPerNewStudent: data.creditsPerNewStudent,
      description: data.description,
      isActive: data.isActive,
      updatedById: data.updatedById,
      updatedAt: data.updatedAt,
      createdAt: data.createdAt,
    });
  }
}
