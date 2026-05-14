import { prisma } from "../lib";
import { PrismaExamConfigRepository } from "../features/examConfig/examConfig.repositary";
import { ExamConfigService } from "../features/examConfig/examConfig.service";
import { ExamConfigController } from "../features/examConfig/examConfig.controller";

export const examConfigRepository = new PrismaExamConfigRepository(prisma);
export const examConfigService = new ExamConfigService(examConfigRepository);
export const examConfigController = new ExamConfigController(examConfigService);
