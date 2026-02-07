import { prisma } from "../lib";
import { ChapterService, ChapterController, PrismaChapterRepository } from "../features";
import { subjectRepository } from "./subject.container";

export const chapterRepository = new PrismaChapterRepository(prisma);
export const chapterService = new ChapterService(chapterRepository, subjectRepository);
export const chapterController = new ChapterController(chapterService);
