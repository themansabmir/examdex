import type { Request, Response } from "express";
import type { ICreditService } from "./credit.service";
import { HttpStatus } from "../../utils";

export class CreditController {
  constructor(private readonly creditService: ICreditService) {}

  /**
   * GET /credits/balance
   * Get current credit balance for authenticated user
   */
  async getBalance(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id;

    if (!userId) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        error: "Unauthorized",
      });
      return;
    }

    const result = await this.creditService.getBalance(userId);

    res.json({
      success: true,
      data: result,
    });
  }

  /**
   * GET /credits/transactions
   * Get paginated transaction history for authenticated user
   */
  async getTransactions(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id;

    if (!userId) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        error: "Unauthorized",
      });
      return;
    }

    const page = req.query.page ? Number.parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? Number.parseInt(req.query.limit as string, 10) : 20;

    const result = await this.creditService.getTransactionHistory({
      userId,
      page,
      limit,
    });

    res.json({
      success: true,
      data: result,
    });
  }

  /**
   * GET /credits/verify-integrity
   * Verify ledger integrity for authenticated user (dev/admin endpoint)
   */
  async verifyIntegrity(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id;

    if (!userId) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        error: "Unauthorized",
      });
      return;
    }

    const result = await this.creditService.verifyLedgerIntegrity(userId);

    res.json({
      success: true,
      data: result,
    });
  }

  /**
   * POST /credits/add (Admin only - for testing/bonus credits)
   * Manually add credits to a user
   */
  async addCredits(req: Request, res: Response): Promise<void> {
    const { userId, amount, transactionType, notes } = req.body;

    const result = await this.creditService.addCredits({
      userId,
      amount,
      transactionType,
      notes,
    });

    res.status(HttpStatus.CREATED).json({
      success: true,
      data: result,
    });
  }
}
