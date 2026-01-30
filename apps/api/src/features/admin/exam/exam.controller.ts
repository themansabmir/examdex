import { ExamService } from "./exam.service";
import { Request, Response } from "express";

export class ExamController {
  constructor(private readonly examService: ExamService) {}

  async create(req: Request, res: Response) {
    try {
      const exam = await this.examService.createExam(req.body);
      res.status(201).json(exam);
    } catch (e: unknown) {
      this.handleError(e as Error, res);
    }
  }

  async getAll(_: Request, res: Response) {
    const exams = await this.examService.getAllExams();
    //Searching , Pagination , Sorting , linting issues , handleError (do not use any)
    res.json(exams);
  }

  async getById(req: Request, res: Response) {
    try {
      const exam = await this.examService.getExamById(req.params.id);
      res.json(exam);
    } catch (e: unknown) {
      this.handleError(e as Error, res);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const exam = await this.examService.updateExam(req.params.id, req.body);
      res.json(exam);
    } catch (e: unknown) {
      this.handleError(e as Error, res); // bad way
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await this.examService.deleteExam(req.params.id);
      res.status(204).send();
    } catch (e: unknown) {
      this.handleError(e as Error, res);
    }
  }

  async getByUserId(req: Request, res: Response) {
    const exams = await this.examService.getExamsByUserId(req.params.userId);
    res.json(exams);
  }

  async publish(req: Request, res: Response) {
    try {
      const exam = await this.examService.publishExam(req.params.id);
      res.json(exam);
    } catch (e: unknown) {
      this.handleError(e as Error, res);
    }
  }

  private handleError(error: Error, res: Response) {
    if (error.message.includes("not found")) {
      res.status(404).json({ error: error.message });
      return;
    }
    if (error.message.includes("exists")) {
      res.status(409).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Internal server error" });
  }
}
