import { Exam } from "./exam.entity";
import type { ExamProps } from "./exam.entity";

import type { CreateExamInputDTO, UpdateExamInputDTO, ExamOutputDTO } from "./exam.dto";

import type { IExamRepository } from "./exam.repository";
import { PrismaExamRepository } from "./exam.repository";

import { ExamService } from "./exam.service";

import { ExamController } from "./exam.controller";

export * from "./exam.schema";

export { Exam, ExamProps };
export type { CreateExamInputDTO, UpdateExamInputDTO, ExamOutputDTO };
export type { IExamRepository };
export { PrismaExamRepository };
export { ExamService };
export { ExamController };
