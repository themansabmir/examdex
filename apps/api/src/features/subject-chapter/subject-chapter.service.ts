import { randomUUID } from "crypto";
import type { ISubjectChapterRepository } from "./subject-chapter.repository";
import { SubjectChapter } from "./subject-chapter.entity";
import type {
  CreateSubjectChapterInputDTO,
  UpdateSubjectChapterInputDTO,
  SubjectChapterOutputDTO,
} from "./subject-chapter.dto";
import { ConflictError, BadRequestError, NotFoundError } from "../../utils";

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
}

export class SubjectChapterService implements ISubjectChapterService {
  constructor(private readonly subjectChapterRepository: ISubjectChapterRepository) {}

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
