import { Subject } from "./subject.entity";
import type { SubjectProps } from "./subject.entity";

import type { CreateSubjectInputDTO, UpdateSubjectInputDTO, SubjectOutputDTO } from "./subject.dto";

import type { ISubjectRepository } from "./subject.repository";
import { PrismaSubjectRepository } from "./subject.repository";

import { SubjectService } from "./subject.service";

import { SubjectController } from "./subject.controller";

export * from "./subject.schema";

export { Subject, SubjectProps };
export type { CreateSubjectInputDTO, UpdateSubjectInputDTO, SubjectOutputDTO };
export type { ISubjectRepository };
export { PrismaSubjectRepository };
export { SubjectService };
export { SubjectController };
