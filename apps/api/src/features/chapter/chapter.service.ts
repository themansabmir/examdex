import type { IChapterRepository } from "./chapter.repository";
import { Chapter } from "./chapter.entity";
import type { CreateChapterInputDTO, BulkCreateChapterInputDTO, UpdateChapterInputDTO, ChapterOutputDTO } from "./chapter.dto";
import { ConflictError, NotFoundError } from "../../utils";
import { randomUUID } from "crypto";
import type { ISubjectRepository } from "../subject/subject.repository";

export class ChapterService {
  constructor(
    private readonly chapterRepository: IChapterRepository,
    private readonly subjectRepository: ISubjectRepository
  ) { }

  async createChapter(input: CreateChapterInputDTO): Promise<ChapterOutputDTO> {
    const existingChapter = await this.chapterRepository.findBySubjectAndCode(
      input.subjectId,
      input.chapterCode
    );
    if (existingChapter) {
      throw new ConflictError(
        "Chapter with this code already exists for this subject",
        "CHAPTER_CODE_EXISTS"
      );
    }

    const chapter = new Chapter({
      id: randomUUID(),
      subjectId: input.subjectId,
      chapterCode: input.chapterCode,
      chapterName: input.chapterName,
      classId: input.classId ?? null,
      isActive: true,
    });

    const savedChapter = await this.chapterRepository.save(chapter);

    return this.toOutputDTO(savedChapter);
  }

  async getChapterById(id: string): Promise<ChapterOutputDTO | null> {
    const chapter = await this.chapterRepository.findById(id);
    if (!chapter) return null;

    return this.toOutputDTO(chapter);
  }

  async getAllChapters(options?: {
    onlyActive?: boolean;
    subjectId?: string;
    classId?: string;
  }): Promise<ChapterOutputDTO[]> {
    const chapters = await this.chapterRepository.findAll(options);
    return chapters.map((chapter) => this.toOutputDTO(chapter));
  }

  async updateChapter(id: string, input: UpdateChapterInputDTO): Promise<ChapterOutputDTO> {
    const existingChapter = await this.chapterRepository.findById(id);
    if (!existingChapter) {
      throw new ConflictError("Chapter not found", "CHAPTER_NOT_FOUND");
    }

    const updatedChapter = await this.chapterRepository.update(id, input);
    return this.toOutputDTO(updatedChapter);
  }

  async deleteChapter(id: string): Promise<void> {
    const existingChapter = await this.chapterRepository.findById(id);
    if (!existingChapter) {
      throw new ConflictError("Chapter not found", "CHAPTER_NOT_FOUND");
    }

    await this.chapterRepository.delete(id);
  }

  async bulkCreateChapters(input: BulkCreateChapterInputDTO): Promise<{ count: number }> {
    // 1. Verify Subject Exists
    const subject = await this.subjectRepository.findById(input.subjectId);
    if (!subject) {
      throw new NotFoundError("Subject not found", "SUBJECT_NOT_FOUND");
    }

    const collection = input.chapters;
    if (collection.length === 0) {
      return { count: 0 };
    }

    // 2. Prepare chapters
    const chaptersToCreate: Chapter[] = collection.map(c => new Chapter({
      id: randomUUID(),
      subjectId: input.subjectId,
      chapterCode: c.chapterCode,
      chapterName: c.chapterName,
      classId: c.classId ?? null,
      isActive: true,
    }));

    // 3. Check for duplicates within input
    const uniqueKeys = new Set(chaptersToCreate.map(c => `${c.subjectId}:${c.chapterCode}`));
    if (uniqueKeys.size !== chaptersToCreate.length) {
      throw new ConflictError("Duplicate chapter codes for same subject in input", "DUPLICATE_INPUT_CHAPTERS");
    }

    // 4. Check against DB
    const existingChapters = await this.chapterRepository.findAll({ subjectId: input.subjectId });
    const existingCodes = new Set(existingChapters.map(c => c.chapterCode));

    const duplicates = chaptersToCreate.filter(c => existingCodes.has(c.chapterCode));
    if (duplicates.length > 0) {
      throw new ConflictError(
        `Chapters already exist: ${duplicates.map(d => d.chapterCode).join(", ")}`,
        "CHAPTER_ALREADY_EXISTS"
      );
    }

    await this.chapterRepository.saveMany(chaptersToCreate);
    return { count: chaptersToCreate.length };
  }

  private toOutputDTO(chapter: Chapter): ChapterOutputDTO {
    return {
      id: chapter.id,
      subjectId: chapter.subjectId,
      chapterCode: chapter.chapterCode,
      chapterName: chapter.chapterName,
      classId: chapter.classId,
      isActive: chapter.isActive,
    };
  }
}
