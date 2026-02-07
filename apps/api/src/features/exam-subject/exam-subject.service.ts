import { randomUUID } from "crypto";
import type { IExamSubjectRepository } from "./exam-subject.repository";
import { ExamSubject } from "./exam-subject.entity";
import type {
  CreateExamSubjectInputDTO,
  UpdateExamSubjectInputDTO,
  ExamSubjectOutputDTO,
} from "./exam-subject.dto";
import { ConflictError, NotFoundError } from "../../utils";

export interface IExamSubjectService {
  createMapping(input: CreateExamSubjectInputDTO): Promise<ExamSubjectOutputDTO>;
  getMappingById(id: string): Promise<ExamSubjectOutputDTO | null>;
  getSubjectsForExam(examId: string, onlyActive?: boolean): Promise<ExamSubjectOutputDTO[]>;
  getExamsForSubject(subjectId: string, onlyActive?: boolean): Promise<ExamSubjectOutputDTO[]>;
  getAllMappings(onlyActive?: boolean): Promise<ExamSubjectOutputDTO[]>;
  updateMapping(id: string, input: UpdateExamSubjectInputDTO): Promise<ExamSubjectOutputDTO>;
  deleteMapping(id: string): Promise<void>;
}

export class ExamSubjectService implements IExamSubjectService {
  constructor(private readonly examSubjectRepository: IExamSubjectRepository) {}

  async createMapping(input: CreateExamSubjectInputDTO): Promise<ExamSubjectOutputDTO> {
    // Check if mapping already exists
    const existing = await this.examSubjectRepository.findByExamAndSubject(
      input.examId,
      input.subjectId
    );
    if (existing) {
      throw new ConflictError(
        "This subject is already mapped to this exam",
        "EXAM_SUBJECT_EXISTS"
      );
    }

    const examSubject = new ExamSubject({
      id: randomUUID(),
      examId: input.examId,
      subjectId: input.subjectId,
      displayOrder: input.displayOrder ?? null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const saved = await this.examSubjectRepository.save(examSubject);
    return this.toOutputDTO(saved);
  }

  async getMappingById(id: string): Promise<ExamSubjectOutputDTO | null> {
    const mapping = await this.examSubjectRepository.findById(id);
    if (!mapping) return null;
    return this.toOutputDTO(mapping);
  }

  async getSubjectsForExam(
    examId: string,
    onlyActive?: boolean
  ): Promise<ExamSubjectOutputDTO[]> {
    const mappings = await this.examSubjectRepository.findByExamId(examId, { onlyActive });
    return mappings.map((m) => this.toOutputDTO(m));
  }

  async getExamsForSubject(
    subjectId: string,
    onlyActive?: boolean
  ): Promise<ExamSubjectOutputDTO[]> {
    const mappings = await this.examSubjectRepository.findBySubjectId(subjectId, { onlyActive });
    return mappings.map((m) => this.toOutputDTO(m));
  }

  async getAllMappings(onlyActive?: boolean): Promise<ExamSubjectOutputDTO[]> {
    const mappings = await this.examSubjectRepository.findAll({ onlyActive });
    return mappings.map((m) => this.toOutputDTO(m));
  }

  async updateMapping(
    id: string,
    input: UpdateExamSubjectInputDTO
  ): Promise<ExamSubjectOutputDTO> {
    const existing = await this.examSubjectRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Exam-Subject mapping not found", "EXAM_SUBJECT_NOT_FOUND");
    }

    const updated = await this.examSubjectRepository.update(id, input);
    return this.toOutputDTO(updated);
  }

  async deleteMapping(id: string): Promise<void> {
    const existing = await this.examSubjectRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Exam-Subject mapping not found", "EXAM_SUBJECT_NOT_FOUND");
    }

    await this.examSubjectRepository.delete(id);
  }

  private toOutputDTO(examSubject: ExamSubject): ExamSubjectOutputDTO {
    return {
      id: examSubject.id,
      examId: examSubject.examId,
      subjectId: examSubject.subjectId,
      displayOrder: examSubject.displayOrder,
      isActive: examSubject.isActive,
      createdAt: examSubject.createdAt,
      updatedAt: examSubject.updatedAt,
    };
  }
}
