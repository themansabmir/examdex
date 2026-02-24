import type { Request, Response } from "express";
import type { IDefaultCreditConfigService } from "./default-credit-config.service";
import { BadRequestError } from "../../utils";

export class DefaultCreditConfigController {
  constructor(private readonly service: IDefaultCreditConfigService) {}

  /**
   * GET /admin/default-credits
   * Get current default credits configuration
   */
  async getDefaultCredits(req: Request, res: Response): Promise<void> {
    const credits = await this.service.getDefaultCredits();

    res.json({
      success: true,
      data: {
        creditsPerNewStudent: credits,
      },
    });
  }

  /**
   * PUT /admin/default-credits
   * Update default credits for new students (Admin only)
   */
  async updateDefaultCredits(req: Request, res: Response): Promise<void> {
    const { creditsPerNewStudent } = req.body;
    const adminId = req.user?.id;

    if (creditsPerNewStudent === undefined || creditsPerNewStudent === null) {
      throw new BadRequestError("creditsPerNewStudent is required");
    }

    if (!Number.isInteger(creditsPerNewStudent) || creditsPerNewStudent < 0) {
      throw new BadRequestError("creditsPerNewStudent must be a non-negative integer");
    }

    const updated = await this.service.updateDefaultCredits(creditsPerNewStudent, adminId);

    res.json({
      success: true,
      data: {
        id: updated.id,
        creditsPerNewStudent: updated.creditsPerNewStudent,
        description: updated.description,
        isActive: updated.isActive,
        updatedAt: updated.updatedAt,
      },
      message: `Default credits updated to ${creditsPerNewStudent}. New registrations will receive this amount.`,
    });
  }

  /**
   * GET /admin/default-credits/history
   * Get history of default credits configuration changes (Admin only)
   */
  async getConfigHistory(req: Request, res: Response): Promise<void> {
    const limit = req.query.limit ? Number.parseInt(req.query.limit as string, 10) : 10;

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new BadRequestError("limit must be between 1 and 100");
    }

    const history = await this.service.getConfigHistory(limit);

    res.json({
      success: true,
      data: {
        history,
        total: history.length,
      },
    });
  }
}
