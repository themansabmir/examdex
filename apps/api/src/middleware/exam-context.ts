import { Request, Response, NextFunction } from "express";
import { examService } from "../features/exam";

import { logger } from "../utils/logger";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const examContextMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const examId = req.headers["x-exam-id"] as string;

  if (!examId) {
    return next();
  }

  if (!UUID_REGEX.test(examId)) {
    logger.warn(`Invalid exam ID format: ${examId}`);
    return next();
  }

  try {
    const exam = await examService.getExamById(examId);

    if (!exam) {
      logger.warn(`Exam not found for ID: ${examId}`);
      return next();
    }

    if (!exam.isActive) {
      logger.warn(`Exam is inactive: ${examId}`);
      return next();
    }

    req.exam = exam;
    next();
  } catch (error) {
    logger.error("Error in exam context middleware", error as Error);
    next(error);
  }
};
