import { Request, Response } from "express";
import { QuestionPaperService } from "./questionPaper.service";
import { PrismaUserRepository } from "../user/user.repository";
import { PrismaExamRepository } from "../exam/exam.repository";
import { prisma } from "../../lib";
import { creditService } from "../../container";

// const prisma = new PrismaClient(); // REMOVED: Do not instantiate directly
const questionPaperService = new QuestionPaperService();
const userRepository = new PrismaUserRepository(prisma);
const examRepository = new PrismaExamRepository(prisma);

export class QuestionPaperController {
  // Generate paper for full exam
  async generateForExam(req: Request, res: Response) {
    const { examId } = req.body;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    // 1. Validate user
    const user = await userRepository.findById(userId);
    if (!user || !user.isActive)
      return res.status(403).json({ success: false, message: "Inactive or missing user" });

    // 2. Validate exam
    const exam = await examRepository.findById(examId);
    if (!exam || !exam.isActive)
      return res.status(404).json({ success: false, message: "Exam not found or inactive" });

    // 3. Check if user has opted for this exam (assume upsertExamPreference or similar logic)
    // TODO: Implement actual check if needed

    // 4. Atomically deduct credit and generate paper
    try {
      // First, generate the paper (mocked for now)
      const paper = await questionPaperService.generatePaper({ examId, userId, type: "full-exam" });

      // Atomically deduct the credit with paper ID as reference
      const deductionResult = await creditService.deductCredit(
        userId,
        paper.id,
        "Paper generation for full exam"
      );

      // TODO: In a real implementation, you'd want to wrap the paper generation
      // and credit deduction in a single transaction. For now, we deduct after generation.
      // If generation fails, no credit is deducted. If deduction fails, paper is orphaned.

      res.json({
        success: true,
        data: {
          paper,
          newBalance: deductionResult.newBalance,
          shouldNotify: deductionResult.shouldNotify,
        },
      });
    } catch (error: any) {
      // If it's an insufficient credits error, return 402
      if (error.code === "INSUFFICIENT_CREDITS") {
        return res.status(402).json({
          success: false,
          message: "Insufficient credits to generate paper",
          code: "INSUFFICIENT_CREDITS",
        });
      }
      throw error;
    }
  }

  // Generate paper for custom subject/topic selection
  async generateCustom(req: Request, res: Response) {
    const { examId, subjectIds, topicIds } = req.body;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    // Validate subjectIds and topicIds as arrays
    if (!Array.isArray(subjectIds) || subjectIds.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "subjectIds must be a non-empty array" });
    }
    if (!Array.isArray(topicIds) || topicIds.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "topicIds must be a non-empty array" });
    }

    // 1. Validate user
    const user = await userRepository.findById(userId);
    if (!user || !user.isActive)
      return res.status(403).json({ success: false, message: "Inactive or missing user" });

    // 2. Validate exam
    const exam = await examRepository.findById(examId);
    if (!exam || !exam.isActive)
      return res.status(404).json({ success: false, message: "Exam not found or inactive" });

    // 4. Atomically deduct credit and generate paper
    try {
      // First, generate the paper (mocked for now)
      const paper = await questionPaperService.generatePaper({
        examId,
        userId,
        type: "custom",
        subjectIds,
        topicIds,
      });

      // Atomically deduct the credit with paper ID as reference
      const deductionResult = await creditService.deductCredit(
        userId,
        paper.id,
        `Custom paper generation: ${subjectIds.length} subjects, ${topicIds.length} topics`
      );

      res.json({
        success: true,
        data: {
          paper,
          newBalance: deductionResult.newBalance,
          shouldNotify: deductionResult.shouldNotify,
        },
      });
    } catch (error: any) {
      // If it's an insufficient credits error, return 402
      if (error.code === "INSUFFICIENT_CREDITS") {
        return res.status(402).json({
          success: false,
          message: "Insufficient credits to generate paper",
          code: "INSUFFICIENT_CREDITS",
        });
      }
      throw error;
    }
  }
}
