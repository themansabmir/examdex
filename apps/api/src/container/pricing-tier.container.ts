import { prisma } from "../lib";
import {
  PricingTierService,
  PricingTierController,
  PrismaPricingTierRepository,
} from "../features";

export const pricingTierRepository = new PrismaPricingTierRepository(prisma);
export const pricingTierService = new PricingTierService(pricingTierRepository);
export const pricingTierController = new PricingTierController(pricingTierService);
