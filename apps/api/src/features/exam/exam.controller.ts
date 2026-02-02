import type { Request, Response } from "express";
import type { ExamService } from "./exam.service";
import { NotFoundError, HttpStatus } from "../../utils";

export class ExamController {
  constructor(private readonly examService: ExamService) {}

  async create(req: Request, res: Response): Promise<void> {
    const exam = await this.examService.createExam(req.body);

    res.status(HttpStatus.CREATED).json({
      success: true,
      data: exam,
    });
  }

  async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const exam = await this.examService.getExamById(id);

    if (!exam) {
      throw new NotFoundError("Exam not found", "EXAM_NOT_FOUND");
    }

    res.json({
      success: true,
      data: exam,
    });
  }

  async getAll(req: Request, res: Response): Promise<void> {
    const onlyActive = req.query.active === "true";
    const onlyPopular = req.query.popular === "true";

    const exams = await this.examService.getAllExams({ onlyActive, onlyPopular });

    res.json({
      success: true,
      data: exams,
    });
  }

  async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const exam = await this.examService.updateExam(id, req.body);

    res.json({
      success: true,
      data: exam,
    });
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await this.examService.deleteExam(id);

    res.status(HttpStatus.NO_CONTENT).send();
  }
}
