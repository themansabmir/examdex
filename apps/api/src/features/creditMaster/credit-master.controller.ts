import type { Request, Response } from "express";
import type { CreditMasterService } from "./credit-master.service";
import { HttpStatus } from "../../utils";

export class CreditMasterController {
  constructor(private readonly service: CreditMasterService) {}

  async create(req: Request, res: Response): Promise<void> {
    const adminId = (req as any).user?.id;
    const result = await this.service.create(req.body, adminId);
    res.status(HttpStatus.CREATED).json({
      success: true,
      data: result,
    });
  }

  async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const result = await this.service.getById(id);
    res.json({
      success: true,
      data: result,
    });
  }

  async getAll(_: Request, res: Response): Promise<void> {
    const result = await this.service.getAll();
    res.json({
      success: true,
      data: result,
    });
  }

  async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const adminId = (req as any).user?.id;
    const result = await this.service.update(id, req.body, adminId);
    res.json({
      success: true,
      data: result,
    });
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await this.service.delete(id);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  async getActive(_: Request, res: Response): Promise<void> {
    const result = await this.service.getActiveConfig();
    res.json({
      success: true,
      data: result,
    });
  }
}
