import { randomUUID } from "crypto";
import type { IExamSubjectRepository } from "./exam-subject.repository";
import { ExamSubject } from "./exam-subject.entity";
import type {
  CreateExamSubjectInputDTO,
  UpdateExamSubjectInputDTO,
  ExamSubjectOutputDTO,
  CreateBulkExamSubjectInputDTO,
  ExamSubjectWithDetailsOutputDTO,
} from "./exam-subject.dto";
import { ConflictError, NotFoundError } from "../../utils";
import type { IExamRepository } from "../exam/exam.repository";
import type { ISubjectRepository } from "../subject/subject.repository";

export interface IExamSubjectService {
  createMapping(input: CreateExamSubjectInputDTO): Promise<ExamSubjectOutputDTO>;
  getMappingById(id: string): Promise<ExamSubjectWithDetailsOutputDTO | null>;
  getSubjectsForExam(examId: string, onlyActive?: boolean): Promise<ExamSubjectWithDetailsOutputDTO[]>;
  getExamsForSubject(subjectId: string, onlyActive?: boolean): Promise<ExamSubjectWithDetailsOutputDTO[]>;
  getAllMappings(onlyActive?: boolean): Promise<ExamSubjectWithDetailsOutputDTO[]>;
  updateMapping(id: string, input: UpdateExamSubjectInputDTO): Promise<ExamSubjectOutputDTO>;
  deleteMapping(id: string): Promise<void>;
  createMappingsForExam(input: CreateBulkExamSubjectInputDTO): Promise<ExamSubjectOutputDTO[]>;
}

export class ExamSubjectService implements IExamSubjectService {
  constructor(
    private readonly examSubjectRepository: IExamSubjectRepository,
    private readonly examRepository: IExamRepository,
    private readonly subjectRepository: ISubjectRepository
  ) { }

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

  async createMappingsForExam(input: CreateBulkExamSubjectInputDTO): Promise<ExamSubjectOutputDTO[]> {
    // 1. Validate Exam Exists
    const exam = await this.examRepository.findById(input.examId);
    if (!exam) {
      throw new NotFoundError("Exam not found", "EXAM_NOT_FOUND");
    }

    if (input.items.length === 0) {
      return [];
    }

    // 2. Validate Subjects Exist
    const subjectIds = [...new Set(input.items.map(i => i.subjectId))];
    const subjects = await this.subjectRepository.findByIds(subjectIds);

    // Create a map for quick lookup
    const subjectMap = new Map(subjects.map(s => [s.id, s]));
    const missingSubjects = subjectIds.filter(id => !subjectMap.has(id));

    if (missingSubjects.length > 0) {
      throw new NotFoundError(`Subjects not found: ${missingSubjects.join(', ')}`, "SUBJECT_NOT_FOUND");
    }

    // 3. Filter out existing mappings to avoid duplicates (Idempotency)
    const existingMappings = await this.examSubjectRepository.findByExamId(input.examId);
    const existingSubjectIds = new Set(existingMappings.map(e => e.subjectId));

    const newItems = input.items.filter(item => !existingSubjectIds.has(item.subjectId));

    if (newItems.length === 0) {
      // All requested mappings already exist
      return existingMappings.filter(m => subjectIds.includes(m.subjectId)).map(m => this.toOutputDTO(m));
    }

    // 4. Create new mappings
    const newMappings: ExamSubject[] = newItems.map(item => new ExamSubject({
      id: randomUUID(),
      examId: input.examId,
      subjectId: item.subjectId,
      displayOrder: item.displayOrder ?? null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await this.examSubjectRepository.saveMany(newMappings);

    // 5. Return all requested mappings (existing + new)
    // We need to fetch again or combine.
    // Let's combining memory for efficiency.
    const createdDTOs = newMappings.map(m => this.toOutputDTO(m));
    const existingDTOs = existingMappings.filter(m => subjectIds.includes(m.subjectId)).map(m => this.toOutputDTO(m));

    return [...existingDTOs, ...createdDTOs];
  }

  private toOutputDTO(examSubject: ExamSubject): ExamSubjectWithDetailsOutputDTO {
    return {
      id: examSubject.id,
      examId: examSubject.examId,
      subjectId: examSubject.subjectId,
      displayOrder: examSubject.displayOrder,
      isActive: examSubject.isActive,
      createdAt: examSubject.createdAt,
      updatedAt: examSubject.updatedAt,
      subject: examSubject.subject,
      exam: examSubject.exam,
    };
  }


}
