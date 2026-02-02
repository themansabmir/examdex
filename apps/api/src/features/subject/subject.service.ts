import type { ISubjectRepository } from "./subject.repository";
import { Subject } from "./subject.entity";
import type { CreateSubjectInputDTO, UpdateSubjectInputDTO, SubjectOutputDTO } from "./subject.dto";
import { ConflictError } from "../../utils";
import { randomUUID } from "crypto";

export class SubjectService {
  constructor(private readonly subjectRepository: ISubjectRepository) {}

  async createSubject(input: CreateSubjectInputDTO): Promise<SubjectOutputDTO> {
    const existingSubject = await this.subjectRepository.findByCode(input.subjectCode);
    if (existingSubject) {
      throw new ConflictError("Subject with this code already exists", "SUBJECT_CODE_EXISTS");
    }

    const subject = new Subject({
      id: randomUUID(),
      subjectCode: input.subjectCode,
      subjectName: input.subjectName,
      isActive: true,
    });

    const savedSubject = await this.subjectRepository.save(subject);

    return this.toOutputDTO(savedSubject);
  }

  async getSubjectById(id: string): Promise<SubjectOutputDTO | null> {
    const subject = await this.subjectRepository.findById(id);
    if (!subject) return null;

    return this.toOutputDTO(subject);
  }

  async getAllSubjects(options?: { onlyActive?: boolean }): Promise<SubjectOutputDTO[]> {
    const subjects = await this.subjectRepository.findAll(options);
    return subjects.map((subject) => this.toOutputDTO(subject));
  }

  async updateSubject(id: string, input: UpdateSubjectInputDTO): Promise<SubjectOutputDTO> {
    const existingSubject = await this.subjectRepository.findById(id);
    if (!existingSubject) {
      throw new ConflictError("Subject not found", "SUBJECT_NOT_FOUND");
    }

    const updatedSubject = await this.subjectRepository.update(id, input);
    return this.toOutputDTO(updatedSubject);
  }

  async deleteSubject(id: string): Promise<void> {
    const existingSubject = await this.subjectRepository.findById(id);
    if (!existingSubject) {
      throw new ConflictError("Subject not found", "SUBJECT_NOT_FOUND");
    }

    await this.subjectRepository.delete(id);
  }

  private toOutputDTO(subject: Subject): SubjectOutputDTO {
    return {
      id: subject.id,
      subjectCode: subject.subjectCode,
      subjectName: subject.subjectName,
      isActive: subject.isActive,
    };
  }
}
