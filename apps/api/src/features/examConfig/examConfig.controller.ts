import { ExamConfigService } from "./examConfig.service";
import type { Request, Response } from "express";
import { HttpStatus } from "../../utils";

export class ExamConfigController {
  constructor(private readonly examConfigService: ExamConfigService) {}

  async createExamConfig(req: Request, res: Response): Promise<void> {
    const examConfig = await this.examConfigService.createExamConfig(req.body);
    res.status(HttpStatus.CREATED).json({
      success: true,
      data: examConfig,
    });
  }

  async updateExamConfig(req: Request, res: Response): Promise<void> {
    const updatedConfig = await this.examConfigService.updateExamConfig(req.params.id, req.body);
    res.status(HttpStatus.OK).json({
      success: true,
      data: updatedConfig,
    });
  }
  async deleteExamConfig(req: Request, res: Response): Promise<void> {
    await this.examConfigService.deleteExamConfig(req.params.id);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  async getAllExamConfigs(req: Request, res: Response): Promise<void> {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const search = (req.query.search as string) || "";
    const examConfig = await this.examConfigService.getAllExamConfigs(page, limit, search);
    res.status(HttpStatus.OK).json({
      success: true,
      data: examConfig,
    });
  }

  async getExamConfigById(req: Request, res: Response): Promise<void> {
    const examConfig = await this.examConfigService.getExamConfigByid(req.params.id);
    res.status(HttpStatus.OK).json({
      success: true,
      data: examConfig,
    });
  }
}
