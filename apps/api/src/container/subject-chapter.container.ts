import { prisma } from "../lib";
import {
  SubjectChapterService,
  SubjectChapterController,
  PrismaSubjectChapterRepository,
} from "../features";
import { examSubjectRepository } from "./exam-subject.container";
import { chapterRepository } from "./chapter.container";
import { examRepository } from "./exam.container";
import { subjectRepository } from "./subject.container";

export const subjectChapterRepository = new PrismaSubjectChapterRepository(prisma);
export const subjectChapterService = new SubjectChapterService(
  subjectChapterRepository,
  examSubjectRepository,
  chapterRepository,
  examRepository,
  subjectRepository
);
export const subjectChapterController = new SubjectChapterController(subjectChapterService);
