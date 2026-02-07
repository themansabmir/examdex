import { Class } from "./class.entity";
import type { ClassProps } from "./class.entity";

import type { CreateClassInputDTO, UpdateClassInputDTO, ClassOutputDTO } from "./class.dto";

import type { IClassRepository } from "./class.repository";
import { PrismaClassRepository } from "./class.repository";

import type { IClassService } from "./class.service";
import { ClassService } from "./class.service";

import { ClassController } from "./class.controller";

export * from "./class.schema";

export { Class };
export type { ClassProps };
export type { CreateClassInputDTO, UpdateClassInputDTO, ClassOutputDTO };
export type { IClassRepository };
export { PrismaClassRepository };
export type { IClassService };
export { ClassService };
export { ClassController };
