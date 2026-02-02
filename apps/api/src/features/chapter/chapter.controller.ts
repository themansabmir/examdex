import type { Request, Response } from "express";
import type { ChapterService } from "./chapter.service";
import { NotFoundError, HttpStatus } from "../../utils";

export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  async create(req: Request, res: Response): Promise<void> {
    const chapter = await this.chapterService.createChapter(req.body);

    res.status(HttpStatus.CREATED).json({
      success: true,
      data: chapter,
    });
  }

  async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const chapter = await this.chapterService.getChapterById(id);

    if (!chapter) {
      throw new NotFoundError("Chapter not found", "CHAPTER_NOT_FOUND");
    }

    res.json({
      success: true,
      data: chapter,
    });
  }

  async getAll(req: Request, res: Response): Promise<void> {
    const onlyActive = req.query.active === "true";
    const subjectId = req.query.subjectId as string | undefined;
    const classId = req.query.classId as string | undefined;

    const chapters = await this.chapterService.getAllChapters({ onlyActive, subjectId, classId });

    res.json({
      success: true,
      data: chapters,
    });
  }

  async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const chapter = await this.chapterService.updateChapter(id, req.body);

    res.json({
      success: true,
      data: chapter,
    });
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await this.chapterService.deleteChapter(id);

    res.status(204).send();
  }
}
