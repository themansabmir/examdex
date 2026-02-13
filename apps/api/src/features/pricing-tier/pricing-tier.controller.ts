import type { Request, Response } from "express";
import type { IPricingTierService } from "./pricing-tier.service";
import { HttpStatus, NotFoundError } from "../../utils";

export class PricingTierController {
  constructor(private readonly pricingTierService: IPricingTierService) {}

  async createTier(req: Request, res: Response): Promise<void> {
    const tier = await this.pricingTierService.createTier(req.body);

    res.status(HttpStatus.CREATED).json({
      success: true,
      data: tier,
    });
  }

  async getTierById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const tier = await this.pricingTierService.getTierById(id);

    if (!tier) {
      throw new NotFoundError("Pricing tier not found", "PRICING_TIER_NOT_FOUND");
    }

    res.json({
      success: true,
      data: tier,
    });
  }

  async getTierByCode(req: Request, res: Response): Promise<void> {
    const { tierCode } = req.params;
    const tier = await this.pricingTierService.getTierByCode(tierCode);

    if (!tier) {
      throw new NotFoundError("Pricing tier not found", "PRICING_TIER_NOT_FOUND");
    }

    res.json({
      success: true,
      data: tier,
    });
  }

  async getAllTiers(req: Request, res: Response): Promise<void> {
    const onlyActive = req.query.active === "true";
    const tiers = await this.pricingTierService.getAllTiers(onlyActive);

    res.json({
      success: true,
      data: tiers,
    });
  }

  async updateTier(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const tier = await this.pricingTierService.updateTier(id, req.body);

    res.json({
      success: true,
      data: tier,
    });
  }

  async deleteTier(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await this.pricingTierService.deleteTier(id);

    res.status(HttpStatus.NO_CONTENT).send();
  }
}
