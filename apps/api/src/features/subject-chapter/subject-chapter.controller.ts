import type { Request, Response } from "express";
import type { ISubjectChapterService } from "./subject-chapter.service";
import { HttpStatus, NotFoundError } from "../../utils";

export class SubjectChapterController {
  constructor(private readonly subjectChapterService: ISubjectChapterService) {}

  async createMapping(req: Request, res: Response): Promise<void> {
    const mapping = await this.subjectChapterService.createMapping(req.body);

    res.status(HttpStatus.CREATED).json({
      success: true,
      data: mapping,
    });
  }

  async getMappingById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const mapping = await this.subjectChapterService.getMappingById(id);

    if (!mapping) {
      throw new NotFoundError("Subject-Chapter mapping not found", "SUBJECT_CHAPTER_NOT_FOUND");
    }

    res.json({
      success: true,
      data: mapping,
    });
  }

  async getAllMappings(req: Request, res: Response): Promise<void> {
    const onlyActive = req.query.active === "true";
    const mappings = await this.subjectChapterService.getAllMappings(onlyActive);

    res.json({
      success: true,
      data: mappings,
    });
  }

  async getChaptersForExamSubject(req: Request, res: Response): Promise<void> {
    const { examSubjectId } = req.params;
    const onlyActive = req.query.active === "true";
    const chapters = await this.subjectChapterService.getChaptersForExamSubject(
      examSubjectId,
      onlyActive
    );

    const totalWeightage =
      await this.subjectChapterService.getTotalWeightageForExamSubject(examSubjectId);

    res.json({
      success: true,
      data: {
        chapters,
        totalWeightage,
        weightageWarning: totalWeightage !== 100 ? "Total weightage is not 100%" : null,
      },
    });
  }

  async getExamSubjectsForChapter(req: Request, res: Response): Promise<void> {
    const { chapterId } = req.params;
    const onlyActive = req.query.active === "true";
    const examSubjects = await this.subjectChapterService.getExamSubjectsForChapter(
      chapterId,
      onlyActive
    );

    res.json({
      success: true,
      data: examSubjects,
    });
  }

  async updateMapping(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const mapping = await this.subjectChapterService.updateMapping(id, req.body);

    res.json({
      success: true,
      data: mapping,
    });
  }

  async deleteMapping(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await this.subjectChapterService.deleteMapping(id);

    res.status(HttpStatus.NO_CONTENT).send();
  }

  async getTotalWeightage(req: Request, res: Response): Promise<void> {
    const { examSubjectId } = req.params;
    const totalWeightage =
      await this.subjectChapterService.getTotalWeightageForExamSubject(examSubjectId);

    res.json({
      success: true,
      data: {
        examSubjectId,
        totalWeightage,
        isComplete: totalWeightage === 100,
        warning:
          totalWeightage !== 100
            ? `Total weightage is ${totalWeightage}%, should be 100%`
            : null,
      },
    });
  }
}
