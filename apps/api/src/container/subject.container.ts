import { prisma } from "../lib";
import { SubjectService, SubjectController, PrismaSubjectRepository } from "../features";

export const subjectRepository = new PrismaSubjectRepository(prisma);
export const subjectService = new SubjectService(subjectRepository);
export const subjectController = new SubjectController(subjectService);
