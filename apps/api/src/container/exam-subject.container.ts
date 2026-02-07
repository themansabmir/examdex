import { prisma } from "../lib";
import { ExamSubjectService, ExamSubjectController, PrismaExamSubjectRepository } from "../features";

export const examSubjectRepository = new PrismaExamSubjectRepository(prisma);
export const examSubjectService = new ExamSubjectService(examSubjectRepository);
export const examSubjectController = new ExamSubjectController(examSubjectService);
