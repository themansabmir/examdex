import { prisma } from "../lib";
import { PrismaGeneratedPaperRepository } from "../features/generatedPaper/generatedPaper.repositary";
import { GeneratedPaperService } from "../features/generatedPaper/generatedPaper.service";
import { GeneratedPaperController } from "../features/generatedPaper/generatedPaper.controller";
import { PrismaUserExamReposiary } from "../features/userExamPrefrence/userExamPrefrence.repositary";
import { QuestionService } from "../features/questionData/questionData.service";
import { examConfigRepository } from "./examConfig.container";
import { examSubjectRepository } from "./exam-subject.container";

export const generatedPaperRepository = new PrismaGeneratedPaperRepository(prisma);
export const userExamRepository = new PrismaUserExamReposiary(prisma);
export const questionService = new QuestionService();

import { userRepository } from "./user.container";

export const generatedPaperService = new GeneratedPaperService(
  generatedPaperRepository,
  userExamRepository,
  questionService,
  examConfigRepository,
  examSubjectRepository,
  userRepository
);
export const generatedPaperController = new GeneratedPaperController(generatedPaperService);
