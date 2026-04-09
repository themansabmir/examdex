import { Request, Response } from "express";
import { QuestionPaperService, QuestionPaperGenerationService } from "./questionPaper.service";
import { GenerateCustomPaperInput, GenerateForExamInput } from "./questionPaper.schema";
import { PrismaUserRepository } from "../user/user.repository";
import { PrismaExamRepository } from "../exam/exam.repository";
import { prisma } from "../../lib";
import { creditService } from "../../container";
import { asyncHandler } from "../../utils/async-handler";
import { UnauthorizedError } from "../../utils";

// const prisma = new PrismaClient(); // REMOVED: Do not instantiate directly
const questionPaperGenerationService = new QuestionPaperGenerationService(
  new QuestionPaperService(),
  new PrismaUserRepository(prisma),
  new PrismaExamRepository(prisma),
  creditService
);

export class QuestionPaperController {
  generateForExam = asyncHandler(async (req: Request, res: Response) => {
    const { examId } = req.body as GenerateForExamInput;
    const userId = this.getAuthenticatedUserId(req);

    const data = await questionPaperGenerationService.generateForExam({
      examId,
      userId,
    });

    res.json({
      success: true,
      data,
    });
  });

  generateCustom = asyncHandler(async (req: Request, res: Response) => {
    const { examId, subjectIds, topicIds } = req.body as GenerateCustomPaperInput;
    const userId = this.getAuthenticatedUserId(req);

    const data = await questionPaperGenerationService.generateCustom({
      examId,
      userId,
      subjectIds,
      topicIds,
    });

    res.json({
      success: true,
      data,
    });
  });

  private getAuthenticatedUserId(req: Request): string {
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedError("Unauthorized", "UNAUTHORIZED");
    }

    return userId;
  }
}
