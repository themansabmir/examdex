import { prisma } from "../lib";
import { ExamSubjectService, ExamSubjectController, PrismaExamSubjectRepository } from "../features";
import { examRepository } from "./exam.container";
import { subjectRepository } from "./subject.container";

export const examSubjectRepository = new PrismaExamSubjectRepository(prisma);
export const examSubjectService = new ExamSubjectService(examSubjectRepository, examRepository, subjectRepository);
export const examSubjectController = new ExamSubjectController(examSubjectService);
