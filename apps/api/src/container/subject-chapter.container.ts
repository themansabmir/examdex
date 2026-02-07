import { prisma } from "../lib";
import {
  SubjectChapterService,
  SubjectChapterController,
  PrismaSubjectChapterRepository,
} from "../features";

export const subjectChapterRepository = new PrismaSubjectChapterRepository(prisma);
export const subjectChapterService = new SubjectChapterService(subjectChapterRepository);
export const subjectChapterController = new SubjectChapterController(subjectChapterService);
