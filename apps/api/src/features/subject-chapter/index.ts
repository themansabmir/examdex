import { SubjectChapter } from "./subject-chapter.entity";
import type { SubjectChapterProps } from "./subject-chapter.entity";

import type {
  CreateSubjectChapterInputDTO,
  UpdateSubjectChapterInputDTO,
  SubjectChapterOutputDTO,
} from "./subject-chapter.dto";

import type { ISubjectChapterRepository } from "./subject-chapter.repository";
import { PrismaSubjectChapterRepository } from "./subject-chapter.repository";

import type { ISubjectChapterService } from "./subject-chapter.service";
import { SubjectChapterService } from "./subject-chapter.service";

import { SubjectChapterController } from "./subject-chapter.controller";

export * from "./subject-chapter.schema";

export { SubjectChapter };
export type { SubjectChapterProps };
export type {
  CreateSubjectChapterInputDTO,
  UpdateSubjectChapterInputDTO,
  SubjectChapterOutputDTO,
};
export type { ISubjectChapterRepository };
export { PrismaSubjectChapterRepository };
export type { ISubjectChapterService };
export { SubjectChapterService };
export { SubjectChapterController };
