import type { PrismaClient } from "@prisma/client";
import { PricingTier } from "./pricing-tier.entity";

export interface IPricingTierRepository {
  save(pricingTier: PricingTier): Promise<PricingTier>;
  findById(id: string): Promise<PricingTier | null>;
  findByCode(tierCode: string): Promise<PricingTier | null>;
  findAll(options?: { onlyActive?: boolean }): Promise<PricingTier[]>;
  update(id: string, data: Partial<PricingTier>): Promise<PricingTier>;
  delete(id: string): Promise<void>;
}

export class PrismaPricingTierRepository implements IPricingTierRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(pricingTier: PricingTier): Promise<PricingTier> {
    const saved = await this.prisma.pricingTier.create({
      data: {
        id: pricingTier.id,
        tierCode: pricingTier.tierCode,
        tierName: pricingTier.tierName,
        priceInr: pricingTier.priceINR,
        credits: pricingTier.credits,
        bonusCredits: pricingTier.bonusCredits,
        displayOrder: pricingTier.displayOrder,
        isActive: pricingTier.isActive,
      },
    });

    return new PricingTier({
      id: saved.id,
      tierCode: saved.tierCode,
      tierName: saved.tierName,
      description: null,
      priceINR: Number(saved.priceInr),
      credits: saved.credits,
      bonusCredits: saved.bonusCredits,
      displayOrder: saved.displayOrder,
      isActive: saved.isActive,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
    });
  }

  async findById(id: string): Promise<PricingTier | null> {
    const tier = await this.prisma.pricingTier.findUnique({
      where: { id },
    });

    if (!tier) return null;

    return new PricingTier({
      id: tier.id,
      tierCode: tier.tierCode,
      tierName: tier.tierName,
      description: null,
      priceINR: Number(tier.priceInr),
      credits: tier.credits,
      bonusCredits: tier.bonusCredits,
      displayOrder: tier.displayOrder,
      isActive: tier.isActive,
      createdAt: tier.createdAt,
      updatedAt: tier.updatedAt,
    });
  }

  async findByCode(tierCode: string): Promise<PricingTier | null> {
    const tier = await this.prisma.pricingTier.findUnique({
      where: { tierCode },
    });

    if (!tier) return null;

    return new PricingTier({
      id: tier.id,
      tierCode: tier.tierCode,
      tierName: tier.tierName,
      description: null,
      priceINR: Number(tier.priceInr),
      credits: tier.credits,
      bonusCredits: tier.bonusCredits,
      displayOrder: tier.displayOrder,
      isActive: tier.isActive,
      createdAt: tier.createdAt,
      updatedAt: tier.updatedAt,
    });
  }

  async findAll(options?: { onlyActive?: boolean }): Promise<PricingTier[]> {
    const tiers = await this.prisma.pricingTier.findMany({
      where: {
        ...(options?.onlyActive && { isActive: true }),
      },
      orderBy: [{ displayOrder: "asc" }, { priceInr: "asc" }],
    });

    return tiers.map(
      (tier) =>
        new PricingTier({
          id: tier.id,
          tierCode: tier.tierCode,
          tierName: tier.tierName,
          description: null,
          priceINR: Number(tier.priceInr),
          credits: tier.credits,
          bonusCredits: tier.bonusCredits,
          displayOrder: tier.displayOrder,
          isActive: tier.isActive,
          createdAt: tier.createdAt,
          updatedAt: tier.updatedAt,
        })
    );
  }

  async update(id: string, data: Partial<PricingTier>): Promise<PricingTier> {
    const updated = await this.prisma.pricingTier.update({
      where: { id },
      data: {
        ...(data.tierName !== undefined && { tierName: data.tierName }),
        ...(data.priceINR !== undefined && { priceInr: data.priceINR }),
        ...(data.credits !== undefined && { credits: data.credits }),
        ...(data.bonusCredits !== undefined && { bonusCredits: data.bonusCredits }),
        ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });

    return new PricingTier({
      id: updated.id,
      tierCode: updated.tierCode,
      tierName: updated.tierName,
      description: null,
      priceINR: Number(updated.priceInr),
      credits: updated.credits,
      bonusCredits: updated.bonusCredits,
      displayOrder: updated.displayOrder,
      isActive: updated.isActive,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.pricingTier.delete({
      where: { id },
    });
  }
}
