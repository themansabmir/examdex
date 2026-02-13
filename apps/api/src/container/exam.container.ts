import { prisma } from "../lib";
import { ExamService, ExamController, PrismaExamRepository } from "../features";

export const examRepository = new PrismaExamRepository(prisma);
export const examService = new ExamService(examRepository);
export const examController = new ExamController(examService);
