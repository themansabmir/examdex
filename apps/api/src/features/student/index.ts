import type { StudentOnboardInputDTO } from "./student.dto";

import type { IStudentRepository } from "./student.repository";
import { PrismaStudentRepository } from "./student.repository";

import { StudentService } from "./student.service";

import { StudentController } from "./student.controller";

export * from "./student.schema";

// export { Subject, SubjectProps };
export type { StudentOnboardInputDTO };
export type { IStudentRepository };
export { PrismaStudentRepository };
export { StudentService };
export { StudentController };
