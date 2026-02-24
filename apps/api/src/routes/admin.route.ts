import { Router } from "express";
import { defaultCreditConfigController } from "../container/user.container";
import { asyncHandler } from "../middleware";

const router = Router();

/**
 * Admin routes for managing default credits configuration
 * All routes require admin role (authentication middleware should be applied at parent route)
 */

// GET /admin/default-credits - Get current default credits
router.get(
  "/default-credits",
  asyncHandler(defaultCreditConfigController.getDefaultCredits.bind(defaultCreditConfigController))
);

// PUT /admin/default-credits - Update default credits
router.put(
  "/default-credits",
  asyncHandler(
    defaultCreditConfigController.updateDefaultCredits.bind(defaultCreditConfigController)
  )
);

// GET /admin/default-credits/history - Get configuration history
router.get(
  "/default-credits/history",
  asyncHandler(defaultCreditConfigController.getConfigHistory.bind(defaultCreditConfigController))
);

export { router as adminRoutes };
