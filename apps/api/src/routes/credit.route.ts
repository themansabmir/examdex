import { Router } from "express";
import { creditController } from "../container";

const router = Router();

// GET /credits/balance - Get current balance
router.get("/balance", (req, res, next) => {
  creditController.getBalance(req, res).catch(next);
});

// GET /credits/transactions - Get transaction history
router.get("/transactions", (req, res, next) => {
  creditController.getTransactions(req, res).catch(next);
});

// GET /credits/verify-integrity - Verify ledger integrity (dev/debug)
router.get("/verify-integrity", (req, res, next) => {
  creditController.verifyIntegrity(req, res).catch(next);
});

// POST /credits/add - Add credits (admin only - should add role check)
router.post("/add", (req, res, next) => {
  creditController.addCredits(req, res).catch(next);
});

export const creditRoutes = router;
