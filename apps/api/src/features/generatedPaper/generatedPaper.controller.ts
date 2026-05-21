import { Request, Response } from "express";
import { GeneratedPaperService } from "./generatedPaper.service";

export class GeneratedPaperController {
  constructor(private readonly generatedPaper: GeneratedPaperService) {}

  async create(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user.id;
    const generatedPaper = await this.generatedPaper.createGeneratedPaper(req.body, userId);

    res.status(200).json({
      success: true,
      data: generatedPaper,
    });
  }

  async getById(req: Request, res: Response): Promise<void> {
    const paperId = req.params.id;
    const userId = (req as any).user.id;

    const paper = await this.generatedPaper.getGeneratedPaperById(paperId, userId);

    res.status(200).json({
      success: true,
      data: paper,
    });
  }
}
