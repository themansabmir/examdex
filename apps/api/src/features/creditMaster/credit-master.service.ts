import { randomUUID } from "crypto";
import { CreditMaster } from "./credit-master.entity";
import type { ICreditMasterRepository } from "./credit-master.repository";
import type {
  CreateCreditMasterInputDTO,
  UpdateCreditMasterInputDTO,
  CreditMasterOutputDTO,
} from "./credit-master.dto";
import { NotFoundError } from "../../utils";

export class CreditMasterService {
  constructor(private readonly repository: ICreditMasterRepository) {}

  async create(input: CreateCreditMasterInputDTO, adminId: string): Promise<CreditMasterOutputDTO> {
    if (input.isActive !== false) {
      await this.repository.deactivateAll();
    }

    const config = new CreditMaster({
      id: randomUUID(),
      creditsPerNewStudent: input.creditsPerNewStudent,
      description: input.description ?? null,
      isActive: input.isActive ?? true,
      updatedById: adminId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const saved = await this.repository.save(config);
    return this.toOutputDTO(saved);
  }

  async getById(id: string): Promise<CreditMasterOutputDTO> {
    const config = await this.repository.findById(id);
    if (!config) {
      throw new NotFoundError("Credit configuration not found", "CREDIT_CONFIG_NOT_FOUND");
    }
    return this.toOutputDTO(config);
  }

  async getAll(): Promise<CreditMasterOutputDTO[]> {
    const configs = await this.repository.findAll();
    return configs.map((c) => this.toOutputDTO(c));
  }

  async update(
    id: string,
    input: UpdateCreditMasterInputDTO,
    adminId: string
  ): Promise<CreditMasterOutputDTO> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError("Credit configuration not found", "CREDIT_CONFIG_NOT_FOUND");
    }

    if (input.isActive === true) {
      await this.repository.deactivateAll();
    }

    const updated = await this.repository.update(id, {
      ...input,
      updatedById: adminId,
    });

    return this.toOutputDTO(updated);
  }

  async delete(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError("Credit configuration not found", "CREDIT_CONFIG_NOT_FOUND");
    }
    await this.repository.delete(id);
  }

  async getActiveConfig(): Promise<CreditMasterOutputDTO | null> {
    const config = await this.repository.findActive();
    if (!config) return null;
    return this.toOutputDTO(config);
  }

  private toOutputDTO(entity: CreditMaster): CreditMasterOutputDTO {
    return {
      id: entity.id,
      creditsPerNewStudent: entity.creditsPerNewStudent,
      description: entity.description,
      isActive: entity.isActive,
      updatedById: entity.updatedById,
      updatedAt: entity.updatedAt,
      createdAt: entity.createdAt,
    };
  }
}
