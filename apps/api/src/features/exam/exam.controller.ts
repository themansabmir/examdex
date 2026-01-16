import type { Request, Response } from "express";
import type { ExamService } from "./exam.service";

export class ExamController {
  constructor(private readonly examService: ExamService) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { title, description, userId, duration, passingScore } = req.body;

      if (!title || !userId) {
        res.status(400).json({
          error: "Missing required fields: title and userId are required",
        });
        return;
      }

      const exam = await this.examService.createExam({
        title,
        description,
        userId,
        duration,
        passingScore,
      });

      res.status(201).json({
        success: true,
        data: exam,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("User not found")) {
          res.status(404).json({ error: error.message });
          return;
        }
        if (error.message.includes("at least")) {
          res.status(400).json({ error: error.message });
          return;
        }
      }

      res.status(500).json({
        error: "Internal server error",
      });
    }
  }

  async publish(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { userId } = req.body;

      if (!userId) {
        res.status(400).json({
          error: "Missing required field: userId is required",
        });
        return;
      }

      const exam = await this.examService.publishExam({ examId: id, userId });

      res.json({
        success: true,
        data: exam,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("not found")) {
          res.status(404).json({ error: error.message });
          return;
        }
        if (error.message.includes("permission")) {
          res.status(403).json({ error: error.message });
          return;
        }
        if (error.message.includes("Only draft")) {
          res.status(400).json({ error: error.message });
          return;
        }
      }

      res.status(500).json({
        error: "Internal server error",
      });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const exam = await this.examService.getExamById(id);

      if (!exam) {
        res.status(404).json({
          error: "Exam not found",
        });
        return;
      }

      res.json({
        success: true,
        data: exam,
      });
    } catch (error) {
      res.status(500).json({
        error: "Internal server error",
      });
    }
  }

  async getByUserId(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const exams = await this.examService.getExamsByUserId(userId);

      res.json({
        success: true,
        data: exams,
      });
    } catch (error) {
      res.status(500).json({
        error: "Internal server error",
      });
    }
  }

  async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const exams = await this.examService.getAllExams();

      res.json({
        success: true,
        data: exams,
      });
    } catch (error) {
      res.status(500).json({
        error: "Internal server error",
      });
    }
  }
}
