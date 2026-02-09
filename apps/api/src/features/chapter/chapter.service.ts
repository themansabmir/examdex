import type { IChapterRepository } from "./chapter.repository";
import { Chapter } from "./chapter.entity";
import type { CreateChapterInputDTO, UpdateChapterInputDTO, ChapterOutputDTO } from "./chapter.dto";
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

  async bulkCreateChapters(inputs: (CreateChapterInputDTO & { subjectCode?: string })[]): Promise<{ count: number }> {
    // 1. Group inputs by subject (either ID or Code)
    const subjectMap = new Map<string, string>(); // Code -> ID

    // Collect all subject codes needed
    const subjectCodes = inputs
      .filter(i => i.subjectCode && !i.subjectId)
      .map(i => i.subjectCode as string);

    if (subjectCodes.length > 0) {
      const subjects = await this.subjectRepository.findAll();
      subjects.forEach(s => subjectMap.set(s.subjectCode, s.id));
    }

    // 2. Prepare chapters with resolved IDs
    const chaptersToCreate: Chapter[] = [];

    for (const input of inputs) {
      let subjectId = input.subjectId;

      // Resolve subject code if ID is missing
      if (!subjectId && input.subjectCode) {
        const resolvedId = subjectMap.get(input.subjectCode);
        if (!resolvedId) {
          throw new NotFoundError(
            `Subject code not found: ${input.subjectCode}`,
            "SUBJECT_NOT_FOUND"
          );
        }
        subjectId = resolvedId;
      } else if (!subjectId) {
        throw new ConflictError("Either subjectId or subjectCode must be provided", "MISSING_SUBJECT_IDENTIFIER");
      }

      chaptersToCreate.push(
        new Chapter({
          id: randomUUID(),
          subjectId: subjectId!, // Assert non-null because valid ID is guaranteed by checks above
          chapterCode: input.chapterCode,
          chapterName: input.chapterName,
          classId: input.classId ?? null,
          isActive: true,
        })
      );
    }

    // Check for duplicates within input
    const uniqueKeys = new Set(chaptersToCreate.map(c => `${c.subjectId}:${c.chapterCode}`));
    if (uniqueKeys.size !== chaptersToCreate.length) {
      throw new ConflictError("Duplicate chapter codes for same subject in input", "DUPLICATE_INPUT_CHAPTERS");
    }

    // Check against DB
    const involvedSubjectIds = new Set(chaptersToCreate.map(c => c.subjectId));
    const allExistingChapters = await this.chapterRepository.findAll();
    const existingSet = new Set(
      allExistingChapters
        .filter(c => involvedSubjectIds.has(c.subjectId))
        .map(c => `${c.subjectId}:${c.chapterCode}`)
    );

    const duplicates = chaptersToCreate.filter(c => existingSet.has(`${c.subjectId}:${c.chapterCode}`));
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
