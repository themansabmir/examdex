import { randomUUID } from "crypto";
import type { IClassRepository } from "./class.repository";
import { Class } from "./class.entity";
import type { CreateClassInputDTO, UpdateClassInputDTO, ClassOutputDTO } from "./class.dto";
import { ConflictError, NotFoundError } from "../../utils";

export interface IClassService {
  createClass(input: CreateClassInputDTO): Promise<ClassOutputDTO>;
  getClassById(id: string): Promise<ClassOutputDTO | null>;
  getClassByCode(classCode: string): Promise<ClassOutputDTO | null>;
  getAllClasses(onlyActive?: boolean): Promise<ClassOutputDTO[]>;
  updateClass(id: string, input: UpdateClassInputDTO): Promise<ClassOutputDTO>;
  deleteClass(id: string): Promise<void>;
}

export class ClassService implements IClassService {
  constructor(private readonly classRepository: IClassRepository) {}

  async createClass(input: CreateClassInputDTO): Promise<ClassOutputDTO> {
    // Check if class code already exists
    const existing = await this.classRepository.findByCode(input.classCode);
    if (existing) {
      throw new ConflictError("Class code already exists", "CLASS_CODE_EXISTS");
    }

    const classEntity = new Class({
      id: randomUUID(),
      classCode: input.classCode,
      className: input.className,
      displayOrder: input.displayOrder ?? null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const saved = await this.classRepository.save(classEntity);
    return this.toOutputDTO(saved);
  }

  async getClassById(id: string): Promise<ClassOutputDTO | null> {
    const classEntity = await this.classRepository.findById(id);
    if (!classEntity) return null;
    return this.toOutputDTO(classEntity);
  }

  async getClassByCode(classCode: string): Promise<ClassOutputDTO | null> {
    const classEntity = await this.classRepository.findByCode(classCode);
    if (!classEntity) return null;
    return this.toOutputDTO(classEntity);
  }

  async getAllClasses(onlyActive?: boolean): Promise<ClassOutputDTO[]> {
    const classes = await this.classRepository.findAll({ onlyActive });
    return classes.map((cls) => this.toOutputDTO(cls));
  }

  async updateClass(id: string, input: UpdateClassInputDTO): Promise<ClassOutputDTO> {
    const existing = await this.classRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Class not found", "CLASS_NOT_FOUND");
    }

    const updated = await this.classRepository.update(id, input);
    return this.toOutputDTO(updated);
  }

  async deleteClass(id: string): Promise<void> {
    const existing = await this.classRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Class not found", "CLASS_NOT_FOUND");
    }

    await this.classRepository.delete(id);
  }

  private toOutputDTO(classEntity: Class): ClassOutputDTO {
    return {
      id: classEntity.id,
      classCode: classEntity.classCode,
      className: classEntity.className,
      displayOrder: classEntity.displayOrder,
      isActive: classEntity.isActive,
      createdAt: classEntity.createdAt,
      updatedAt: classEntity.updatedAt,
    };
  }
}
