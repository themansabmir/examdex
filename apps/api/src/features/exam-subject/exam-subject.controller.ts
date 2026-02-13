import type { Request, Response } from "express";
import type { IExamSubjectService } from "./exam-subject.service";
import { HttpStatus, NotFoundError } from "../../utils";

export class ExamSubjectController {
  constructor(private readonly examSubjectService: IExamSubjectService) {}

  async createMapping(req: Request, res: Response): Promise<void> {
    const mapping = await this.examSubjectService.createMapping(req.body);

    res.status(HttpStatus.CREATED).json({
      success: true,
      data: mapping,
    });
  }

  async getMappingById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const mapping = await this.examSubjectService.getMappingById(id);

    if (!mapping) {
      throw new NotFoundError("Exam-Subject mapping not found", "EXAM_SUBJECT_NOT_FOUND");
    }

    res.json({
      success: true,
      data: mapping,
    });
  }

  async getAllMappings(req: Request, res: Response): Promise<void> {
    const onlyActive = req.query.active === "true";
    const mappings = await this.examSubjectService.getAllMappings(onlyActive);

    res.json({
      success: true,
      data: mappings,
    });
  }

  async getSubjectsForExam(req: Request, res: Response): Promise<void> {
    const { examId } = req.params;
    const onlyActive = req.query.active === "true";
    const subjects = await this.examSubjectService.getSubjectsForExam(examId, onlyActive);

    res.json({
      success: true,
      data: subjects,
    });
  }

  async getExamsForSubject(req: Request, res: Response): Promise<void> {
    const { subjectId } = req.params;
    const onlyActive = req.query.active === "true";
    const exams = await this.examSubjectService.getExamsForSubject(subjectId, onlyActive);

    res.json({
      success: true,
      data: exams,
    });
  }

  async updateMapping(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const mapping = await this.examSubjectService.updateMapping(id, req.body);

    res.json({
      success: true,
      data: mapping,
    });
  }

  async deleteMapping(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await this.examSubjectService.deleteMapping(id);

    res.status(HttpStatus.NO_CONTENT).send();
  }
}
