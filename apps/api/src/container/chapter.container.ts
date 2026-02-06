import { prisma } from "../lib";
import { ChapterService, ChapterController, PrismaChapterRepository } from "../features";

export const chapterRepository = new PrismaChapterRepository(prisma);
export const chapterService = new ChapterService(chapterRepository);
export const chapterController = new ChapterController(chapterService);
