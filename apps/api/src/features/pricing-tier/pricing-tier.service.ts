import { randomUUID } from "crypto";
import type { IPricingTierRepository } from "./pricing-tier.repository";
import { PricingTier } from "./pricing-tier.entity";
import type {
  CreatePricingTierInputDTO,
  UpdatePricingTierInputDTO,
  PricingTierOutputDTO,
} from "./pricing-tier.dto";
import { ConflictError, NotFoundError } from "../../utils";

export interface IPricingTierService {
  createTier(input: CreatePricingTierInputDTO): Promise<PricingTierOutputDTO>;
  getTierById(id: string): Promise<PricingTierOutputDTO | null>;
  getTierByCode(tierCode: string): Promise<PricingTierOutputDTO | null>;
  getAllTiers(onlyActive?: boolean): Promise<PricingTierOutputDTO[]>;
  updateTier(id: string, input: UpdatePricingTierInputDTO): Promise<PricingTierOutputDTO>;
  deleteTier(id: string): Promise<void>;
}

export class PricingTierService implements IPricingTierService {
  constructor(private readonly pricingTierRepository: IPricingTierRepository) {}

  async createTier(input: CreatePricingTierInputDTO): Promise<PricingTierOutputDTO> {
    // Check if tier code already exists
    const existing = await this.pricingTierRepository.findByCode(input.tierCode);
    if (existing) {
      throw new ConflictError("Tier code already exists", "TIER_CODE_EXISTS");
    }

    const pricingTier = new PricingTier({
      id: randomUUID(),
      tierCode: input.tierCode,
      tierName: input.tierName,
      description: input.description ?? null,
      priceINR: input.priceINR,
      credits: input.credits,
      bonusCredits: input.bonusCredits,
      displayOrder: input.displayOrder ?? null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const saved = await this.pricingTierRepository.save(pricingTier);
    return this.toOutputDTO(saved);
  }

  async getTierById(id: string): Promise<PricingTierOutputDTO | null> {
    const tier = await this.pricingTierRepository.findById(id);
    if (!tier) return null;
    return this.toOutputDTO(tier);
  }

  async getTierByCode(tierCode: string): Promise<PricingTierOutputDTO | null> {
    const tier = await this.pricingTierRepository.findByCode(tierCode);
    if (!tier) return null;
    return this.toOutputDTO(tier);
  }

  async getAllTiers(onlyActive?: boolean): Promise<PricingTierOutputDTO[]> {
    const tiers = await this.pricingTierRepository.findAll({ onlyActive });
    return tiers.map((tier) => this.toOutputDTO(tier));
  }

  async updateTier(
    id: string,
    input: UpdatePricingTierInputDTO
  ): Promise<PricingTierOutputDTO> {
    const existing = await this.pricingTierRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Pricing tier not found", "PRICING_TIER_NOT_FOUND");
    }

    const updated = await this.pricingTierRepository.update(id, input);
    return this.toOutputDTO(updated);
  }

  async deleteTier(id: string): Promise<void> {
    const existing = await this.pricingTierRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Pricing tier not found", "PRICING_TIER_NOT_FOUND");
    }

    await this.pricingTierRepository.delete(id);
  }

  private toOutputDTO(pricingTier: PricingTier): PricingTierOutputDTO {
    return {
      id: pricingTier.id,
      tierCode: pricingTier.tierCode,
      tierName: pricingTier.tierName,
      description: pricingTier.description,
      priceINR: pricingTier.priceINR,
      credits: pricingTier.credits,
      bonusCredits: pricingTier.bonusCredits,
      totalCredits: pricingTier.getTotalCredits(),
      costPerCredit: pricingTier.getCostPerCredit(),
      displayOrder: pricingTier.displayOrder,
      isActive: pricingTier.isActive,
      createdAt: pricingTier.createdAt,
      updatedAt: pricingTier.updatedAt,
    };
  }
}
