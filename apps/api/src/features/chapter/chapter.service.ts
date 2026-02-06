import type { IChapterRepository } from "./chapter.repository";
import { Chapter } from "./chapter.entity";
import type { CreateChapterInputDTO, UpdateChapterInputDTO, ChapterOutputDTO } from "./chapter.dto";
import { ConflictError } from "../../utils";
import { randomUUID } from "crypto";

export class ChapterService {
  constructor(private readonly chapterRepository: IChapterRepository) {}

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

  async bulkCreateChapters(inputs: CreateChapterInputDTO[]): Promise<{ count: number }> {
    const chapters = inputs.map(
      (input) =>
        new Chapter({
          id: randomUUID(),
          subjectId: input.subjectId,
          chapterCode: input.chapterCode,
          chapterName: input.chapterName,
          classId: input.classId ?? null,
          isActive: true,
        })
    );

    await this.chapterRepository.saveMany(chapters);
    return { count: chapters.length };
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
