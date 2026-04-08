import { prisma } from "../lib";
import { StudentService, StudentController, PrismaStudentRepository } from "../features";

export const studentRepository = new PrismaStudentRepository(prisma);
export const studentService = new StudentService(studentRepository);
export const studentController = new StudentController(studentService);
