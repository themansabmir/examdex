import { ExamSubject } from "./exam-subject.entity";
import type { ExamSubjectProps } from "./exam-subject.entity";

import type {
  CreateExamSubjectInputDTO,
  UpdateExamSubjectInputDTO,
  ExamSubjectOutputDTO,
} from "./exam-subject.dto";

import type { IExamSubjectRepository } from "./exam-subject.repository";
import { PrismaExamSubjectRepository } from "./exam-subject.repository";

import type { IExamSubjectService } from "./exam-subject.service";
import { ExamSubjectService } from "./exam-subject.service";

import { ExamSubjectController } from "./exam-subject.controller";

export * from "./exam-subject.schema";

export { ExamSubject };
export type { ExamSubjectProps };
export type { CreateExamSubjectInputDTO, UpdateExamSubjectInputDTO, ExamSubjectOutputDTO };
export type { IExamSubjectRepository };
export { PrismaExamSubjectRepository };
export type { IExamSubjectService };
export { ExamSubjectService };
export { ExamSubjectController };
