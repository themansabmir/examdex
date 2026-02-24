import { Router } from "express";
import { asyncHandler } from "../middleware";
import { creditController } from "../container";

const router = Router();

// GET /credits/balance - Get current balance
router.get("/balance", asyncHandler(creditController.getBalance.bind(creditController)));

// GET /credits/transactions - Get transaction history
router.get("/transactions", asyncHandler(creditController.getTransactions.bind(creditController)));

// GET /credits/verify-integrity - Verify ledger integrity (dev/debug)
router.get(
  "/verify-integrity",
  asyncHandler(creditController.verifyIntegrity.bind(creditController))
);

// POST /credits/add - Add credits (admin only - should add role check)
router.post("/add", asyncHandler(creditController.addCredits.bind(creditController)));

export { router as creditRoutes };
