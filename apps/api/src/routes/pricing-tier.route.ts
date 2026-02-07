import { Router } from "express";
import { pricingTierController } from "../container";
import { validateBody, validateParams } from "../middleware";
import {
  createPricingTierSchema,
  updatePricingTierSchema,
  pricingTierIdParamSchema,
  tierCodeParamSchema,
} from "../features/pricing-tier/pricing-tier.schema";

const router = Router();

// Create pricing tier
router.post("/", validateBody(createPricingTierSchema), (req, res, next) => {
  pricingTierController.createTier(req, res).catch(next);
});

// Get all pricing tiers
router.get("/", (req, res, next) => {
  pricingTierController.getAllTiers(req, res).catch(next);
});

// Get pricing tier by code (must come before /:id to avoid route conflicts)
router.get("/code/:tierCode", validateParams(tierCodeParamSchema), (req, res, next) => {
  pricingTierController.getTierByCode(req, res).catch(next);
});

// Get pricing tier by ID
router.get("/:id", validateParams(pricingTierIdParamSchema), (req, res, next) => {
  pricingTierController.getTierById(req, res).catch(next);
});

// Update pricing tier
router.patch(
  "/:id",
  validateParams(pricingTierIdParamSchema),
  validateBody(updatePricingTierSchema),
  (req, res, next) => {
    pricingTierController.updateTier(req, res).catch(next);
  }
);

// Delete pricing tier
router.delete("/:id", validateParams(pricingTierIdParamSchema), (req, res, next) => {
  pricingTierController.deleteTier(req, res).catch(next);
});

export const pricingTierRoutes = router;
