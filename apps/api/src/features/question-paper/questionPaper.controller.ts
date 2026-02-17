import { Request, Response } from "express";
import { QuestionPaperService } from "./questionPaper.service";
import { PrismaUserRepository } from "../user/user.repository";
import { PrismaExamRepository } from "../exam/exam.repository";
import { prisma } from "../../lib";

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

    // 4. Check credits
    if (user.creditBalance < 1)
      return res.status(402).json({ success: false, message: "Insufficient credits" });

    // 5. Transaction: generate paper, store, reduce credits
    const result = await prisma.$transaction(async (tx) => {
      // Generate paper (mocked)
      const paper = await questionPaperService.generatePaper({ examId, userId, type: "full-exam" });
      // Store paper (mocked, replace with actual DB logic)
      // await tx.questionPaper.create({ data: { ... } });
      // Reduce credits
      // Workaround: Use raw SQL to decrement creditBalance
      await tx.$executeRaw`UPDATE "users" SET "credit_balance" = "credit_balance" - 1 WHERE "id" = ${userId}`;
      return paper;
    });

    res.json({ success: true, data: result });
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

    // 3. Check credits
    if (user.creditBalance < 1)
      return res.status(402).json({ success: false, message: "Insufficient credits" });

    // 4. Transaction: generate paper, store, reduce credits
    const result = await prisma.$transaction(async (tx) => {
      // Generate paper (mocked)
      const paper = await questionPaperService.generatePaper({
        examId,
        userId,
        type: "custom",
        subjectIds,
        topicIds,
      });
      // Store paper (mocked, replace with actual DB logic)
      // await tx.questionPaper.create({ data: { ... } });
      // Reduce credits
      // Workaround: Use raw SQL to decrement creditBalance
      await tx.$executeRaw`UPDATE "users" SET "credit_balance" = "credit_balance" - 1 WHERE "id" = ${userId}`;
      return paper;
    });

    res.json({ success: true, data: result });
  }
}
