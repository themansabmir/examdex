import { randomUUID } from "crypto";
import type { ISubjectChapterRepository } from "./subject-chapter.repository";
import { SubjectChapter } from "./subject-chapter.entity";
import type {
  CreateSubjectChapterInputDTO,
  UpdateSubjectChapterInputDTO,
  SubjectChapterOutputDTO,
} from "./subject-chapter.dto";
import { ConflictError, BadRequestError, NotFoundError } from "../../utils";
import type { IExamSubjectRepository } from "../exam-subject/exam-subject.repository";
import type { IChapterRepository } from "../chapter/chapter.repository";
import type { IExamRepository } from "../exam/exam.repository";
import type { ISubjectRepository } from "../subject/subject.repository";

export interface ISubjectChapterService {
  createMapping(input: CreateSubjectChapterInputDTO): Promise<SubjectChapterOutputDTO>;
  getMappingById(id: string): Promise<SubjectChapterOutputDTO | null>;
  getChaptersForExamSubject(
    examSubjectId: string,
    onlyActive?: boolean
  ): Promise<SubjectChapterOutputDTO[]>;
  getExamSubjectsForChapter(
    chapterId: string,
    onlyActive?: boolean
  ): Promise<SubjectChapterOutputDTO[]>;
  getAllMappings(onlyActive?: boolean): Promise<SubjectChapterOutputDTO[]>;
  updateMapping(
    id: string,
    input: UpdateSubjectChapterInputDTO
  ): Promise<SubjectChapterOutputDTO>;
  deleteMapping(id: string): Promise<void>;
  getTotalWeightageForExamSubject(examSubjectId: string): Promise<number>;
  bulkCreateMappings(inputs: { examCode: string; subjectCode: string; chapterCode: string; chapterNumber?: number; weightagePercentage: number }[]): Promise<{ count: number }>;
}

export class SubjectChapterService implements ISubjectChapterService {
  constructor(
    private readonly subjectChapterRepository: ISubjectChapterRepository,
    private readonly examSubjectRepository: IExamSubjectRepository,
    private readonly chapterRepository: IChapterRepository,
    private readonly examRepository: IExamRepository,
    private readonly subjectRepository: ISubjectRepository
  ) { }

  async createMapping(input: CreateSubjectChapterInputDTO): Promise<SubjectChapterOutputDTO> {
    // Validate weightage
    if (input.weightagePercentage < 0 || input.weightagePercentage > 100) {
      throw new BadRequestError("Weightage must be between 0 and 100", "INVALID_WEIGHTAGE");
    }

    // Check if mapping already exists
    const existing = await this.subjectChapterRepository.findByExamSubjectAndChapter(
      input.examSubjectId,
      input.chapterId
    );
    if (existing) {
      throw new ConflictError(
        "This chapter is already mapped to this exam-subject",
        "SUBJECT_CHAPTER_EXISTS"
      );
    }

    const subjectChapter = new SubjectChapter({
      id: randomUUID(),
      examSubjectId: input.examSubjectId,
      chapterId: input.chapterId,
      chapterNumber: input.chapterNumber ?? null,
      weightagePercentage: input.weightagePercentage,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const saved = await this.subjectChapterRepository.save(subjectChapter);
    return this.toOutputDTO(saved);
  }

  async getMappingById(id: string): Promise<SubjectChapterOutputDTO | null> {
    const mapping = await this.subjectChapterRepository.findById(id);
    if (!mapping) return null;
    return this.toOutputDTO(mapping);
  }

  async getChaptersForExamSubject(
    examSubjectId: string,
    onlyActive?: boolean
  ): Promise<SubjectChapterOutputDTO[]> {
    const mappings = await this.subjectChapterRepository.findByExamSubjectId(examSubjectId, {
      onlyActive,
    });
    return mappings.map((m) => this.toOutputDTO(m));
  }

  async getExamSubjectsForChapter(
    chapterId: string,
    onlyActive?: boolean
  ): Promise<SubjectChapterOutputDTO[]> {
    const mappings = await this.subjectChapterRepository.findByChapterId(chapterId, { onlyActive });
    return mappings.map((m) => this.toOutputDTO(m));
  }

  async getAllMappings(onlyActive?: boolean): Promise<SubjectChapterOutputDTO[]> {
    const mappings = await this.subjectChapterRepository.findAll({ onlyActive });
    return mappings.map((m) => this.toOutputDTO(m));
  }

  async updateMapping(
    id: string,
    input: UpdateSubjectChapterInputDTO
  ): Promise<SubjectChapterOutputDTO> {
    const existing = await this.subjectChapterRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Subject-Chapter mapping not found", "SUBJECT_CHAPTER_NOT_FOUND");
    }

    // Validate weightage if provided
    if (input.weightagePercentage !== undefined) {
      if (input.weightagePercentage < 0 || input.weightagePercentage > 100) {
        throw new BadRequestError("Weightage must be between 0 and 100", "INVALID_WEIGHTAGE");
      }
    }

    const updated = await this.subjectChapterRepository.update(id, input);
    return this.toOutputDTO(updated);
  }

  async deleteMapping(id: string): Promise<void> {
    const existing = await this.subjectChapterRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Subject-Chapter mapping not found", "SUBJECT_CHAPTER_NOT_FOUND");
    }

    await this.subjectChapterRepository.delete(id);
  }

  async getTotalWeightageForExamSubject(examSubjectId: string): Promise<number> {
    const chapters = await this.subjectChapterRepository.findByExamSubjectId(examSubjectId, {
      onlyActive: true,
    });

    return chapters.reduce((total, ch) => total + ch.weightagePercentage, 0);
  }

  async bulkCreateMappings(inputs: { examCode: string; subjectCode: string; chapterCode: string; chapterNumber?: number; weightagePercentage: number }[]): Promise<{ count: number }>;
  async bulkCreateMappings(inputs: { examCode: string; subjectCode: string; chapterCode: string; chapterNumber?: number; weightagePercentage: number }[]): Promise<{ count: number }> {
    // 1. Resolve Codes to IDs
    const examCodes = [...new Set(inputs.map(i => i.examCode))];
    const subjectCodes = [...new Set(inputs.map(i => i.subjectCode))];

    const exams = await this.examRepository.findAll();
    const subjects = await this.subjectRepository.findAll();
    const chapters = await this.chapterRepository.findAll();

    const examMap = new Map(exams.map(e => [e.examCode, e.id]));
    const subjectMap = new Map(subjects.map(s => [s.subjectCode, s.id]));

    // Validate Exams and Subjects existence first
    const missingExams = examCodes.filter(c => !examMap.has(c));
    if (missingExams.length > 0) throw new NotFoundError(`Exams not found: ${missingExams.join(', ')}`, "EXAM_NOT_FOUND");

    const missingSubjects = subjectCodes.filter(c => !subjectMap.has(c));
    if (missingSubjects.length > 0) throw new NotFoundError(`Subjects not found: ${missingSubjects.join(', ')}`, "SUBJECT_NOT_FOUND");

    // Pre-fetch all exam-subjects to map (examId, subjectId) -> examSubjectId
    const examSubjects = await this.examSubjectRepository.findAll();
    const examSubjectMap = new Map<string, string>(); // `${examId}:${subjectId}` -> examSubjectId
    examSubjects.forEach(es => examSubjectMap.set(`${es.examId}:${es.subjectId}`, es.id));

    // 2. Prepare Data
    const mappings: SubjectChapter[] = [];
    const missingExamSubjects = new Set<string>();
    const missingChapterCodes = new Set<string>();

    // Helper map for chapters: `${subjectId}:${chapterCode}` -> chapterId
    const chapterMap = new Map<string, string>();
    chapters.forEach(c => chapterMap.set(`${c.subjectId}:${c.chapterCode}`, c.id));

    for (const input of inputs) {
      const examId = examMap.get(input.examCode)!;
      const subjectId = subjectMap.get(input.subjectCode)!;

      // Resolve ExamSubject ID
      const examSubjectId = examSubjectMap.get(`${examId}:${subjectId}`);
      if (!examSubjectId) {
        missingExamSubjects.add(`${input.examCode}-${input.subjectCode}`);
        continue;
      }

      // Resolve Chapter ID
      const chapterId = chapterMap.get(`${subjectId}:${input.chapterCode}`);
      if (!chapterId) {
        missingChapterCodes.add(`${input.subjectCode}-${input.chapterCode}`);
        continue;
      }

      // Validate weightage
      if (input.weightagePercentage < 0 || input.weightagePercentage > 100) {
        throw new BadRequestError(`Invalid weightage for ${input.chapterCode}: ${input.weightagePercentage}`, "INVALID_WEIGHTAGE");
      }

      mappings.push(new SubjectChapter({
        id: randomUUID(),
        examSubjectId,
        chapterId,
        chapterNumber: input.chapterNumber ?? null,
        weightagePercentage: input.weightagePercentage,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }));
    }

    if (missingExamSubjects.size > 0) {
      throw new NotFoundError(`Exam-Subject mappings not found for: ${[...missingExamSubjects].join(', ')}`, "EXAM_SUBJECT_NOT_FOUND");
    }
    if (missingChapterCodes.size > 0) {
      throw new NotFoundError(`Chapters not found for: ${[...missingChapterCodes].join(', ')}`, "CHAPTER_NOT_FOUND");
    }

    // 3. Duplicate Checks
    const uniqueKeys = new Set(mappings.map(m => `${m.examSubjectId}:${m.chapterId}`));
    if (uniqueKeys.size !== mappings.length) {
      throw new ConflictError("Duplicate chapter mappings in input", "DUPLICATE_INPUT_MAPPINGS");
    }

    // Check against DB
    // Optimization: Filter in memory
    const allMappings = await this.subjectChapterRepository.findAll();
    const existingSet = new Set(allMappings.map(m => `${m.examSubjectId}:${m.chapterId}`));

    const duplicates = mappings.filter(m => existingSet.has(`${m.examSubjectId}:${m.chapterId}`));
    if (duplicates.length > 0) {
      throw new ConflictError("Some chapter mappings already exist", "MAPPING_EXISTS");
    }

    // 4. Save
    await this.subjectChapterRepository.saveMany(mappings);
    return { count: mappings.length };
  }

  private toOutputDTO(subjectChapter: SubjectChapter): SubjectChapterOutputDTO {
    return {
      id: subjectChapter.id,
      examSubjectId: subjectChapter.examSubjectId,
      chapterId: subjectChapter.chapterId,
      chapterNumber: subjectChapter.chapterNumber,
      weightagePercentage: subjectChapter.weightagePercentage,
      isActive: subjectChapter.isActive,
      createdAt: subjectChapter.createdAt,
      updatedAt: subjectChapter.updatedAt,
    };
  }
}
