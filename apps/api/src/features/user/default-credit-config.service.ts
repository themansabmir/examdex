import type { PrismaClient } from "@prisma/client";

export interface DefaultCreditConfig {
  id: string;
  creditsPerNewStudent: number;
  description?: string | null;
  isActive: boolean;
  updatedById?: string | null;
  updatedAt: Date;
  createdAt: Date;
}

export interface IDefaultCreditConfigRepository {
  getActive(): Promise<DefaultCreditConfig | null>;
  updateCredits(creditsPerNewStudent: number, updatedById?: string): Promise<DefaultCreditConfig>;
  getHistory(limit?: number): Promise<DefaultCreditConfig[]>;
}

export class PrismaDefaultCreditConfigRepository implements IDefaultCreditConfigRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getActive(): Promise<DefaultCreditConfig | null> {
    const config = await (this.prisma as any).defaultCreditConfig.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: "desc" },
    });

    if (!config) return null;

    return this.mapToEntity(config);
  }

  async updateCredits(
    creditsPerNewStudent: number,
    updatedById?: string
  ): Promise<DefaultCreditConfig> {
    if (creditsPerNewStudent < 0) {
      throw new Error("Credits cannot be negative");
    }

    // Deactivate previous config
    await (this.prisma as any).defaultCreditConfig.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    // Create new config
    const newConfig = await (this.prisma as any).defaultCreditConfig.create({
      data: {
        creditsPerNewStudent,
        isActive: true,
        updatedById,
        description: `Updated to ${creditsPerNewStudent} credits per new student`,
      },
    });

    return this.mapToEntity(newConfig);
  }

  async getHistory(limit: number = 10): Promise<DefaultCreditConfig[]> {
    const configs = await (this.prisma as any).defaultCreditConfig.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return configs.map((config: any) => this.mapToEntity(config));
  }

  private mapToEntity(config: any): DefaultCreditConfig {
    return {
      id: config.id,
      creditsPerNewStudent: config.creditsPerNewStudent,
      description: config.description,
      isActive: config.isActive,
      updatedById: config.updatedById,
      updatedAt: config.updatedAt,
      createdAt: config.createdAt,
    };
  }
}

export interface IDefaultCreditConfigService {
  getDefaultCredits(): Promise<number>;
  updateDefaultCredits(
    creditsPerNewStudent: number,
    updatedById?: string
  ): Promise<DefaultCreditConfig>;
  getConfigHistory(limit?: number): Promise<DefaultCreditConfig[]>;
}

export class DefaultCreditConfigService implements IDefaultCreditConfigService {
  constructor(private readonly repository: IDefaultCreditConfigRepository) {}

  async getDefaultCredits(): Promise<number> {
    const config = await this.repository.getActive();
    return config?.creditsPerNewStudent ?? 10;
  }

  async updateDefaultCredits(
    creditsPerNewStudent: number,
    updatedById?: string
  ): Promise<DefaultCreditConfig> {
    return this.repository.updateCredits(creditsPerNewStudent, updatedById);
  }

  async getConfigHistory(limit?: number): Promise<DefaultCreditConfig[]> {
    return this.repository.getHistory(limit);
  }
}
