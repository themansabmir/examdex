import type { ISubjectRepository } from "./subject.repository";
import { Subject } from "./subject.entity";
import type { CreateSubjectInputDTO, UpdateSubjectInputDTO, SubjectOutputDTO } from "./subject.dto";
import { ConflictError } from "../../utils";
import { randomUUID } from "crypto";

export class SubjectService {
  constructor(private readonly subjectRepository: ISubjectRepository) { }

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

  async bulkCreateSubjects(inputs: CreateSubjectInputDTO[]): Promise<{ count: number }> {
    // 1. Validate for duplicates within the input array
    const codes = inputs.map((i) => i.subjectCode);
    const uniqueCodes = new Set(codes);
    if (uniqueCodes.size !== codes.length) {
      throw new ConflictError(
        "Duplicate subject codes found in input",
        "DUPLICATE_INPUT_CODES"
      );
    }

    // 2. Check for existing subjects in DB
    const existingSubjects = await this.subjectRepository.findAll();
    const existingCodes = new Set(existingSubjects.map((s) => s.subjectCode));

    const duplicates = codes.filter((code) => existingCodes.has(code));
    if (duplicates.length > 0) {
      throw new ConflictError(
        `Subjects with these codes already exist: ${duplicates.join(", ")}`,
        "SUBJECT_CODE_EXISTS"
      );
    }

    // 3. Prepare data
    const subjects = inputs.map(
      (input) =>
        new Subject({
          id: randomUUID(),
          subjectCode: input.subjectCode,
          subjectName: input.subjectName,
          isActive: true,
        })
    );

    // 4. Atomic Insert
    await this.subjectRepository.saveMany(subjects);
    return { count: subjects.length };
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
