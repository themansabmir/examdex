import type { Request, Response } from "express";
import type { ExamService } from "./exam.service";
import { NotFoundError, HttpStatus } from "../../utils";

export class ExamController {
  constructor(private readonly examService: ExamService) {}

  async create(req: Request, res: Response): Promise<void> {
    const { title, description, userId, duration, passingScore } = req.body;

    const exam = await this.examService.createExam({
      title,
      description,
      userId,
      duration,
      passingScore,
    });

    res.status(HttpStatus.CREATED).json({
      success: true,
      data: exam,
    });
  }

  async publish(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { userId } = req.body;

    const exam = await this.examService.publishExam({ examId: id, userId });

    res.json({
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

  async getByUserId(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    const exams = await this.examService.getExamsByUserId(userId);

    res.json({
      success: true,
      data: exams,
    });
  }

  async getAll(_req: Request, res: Response): Promise<void> {
    const exams = await this.examService.getAllExams();

    res.json({
      success: true,
      data: exams,
    });
  }
}
