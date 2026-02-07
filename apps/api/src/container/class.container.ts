import { prisma } from "../lib";
import { ClassService, ClassController, PrismaClassRepository } from "../features";

export const classRepository = new PrismaClassRepository(prisma);
export const classService = new ClassService(classRepository);
export const classController = new ClassController(classService);
