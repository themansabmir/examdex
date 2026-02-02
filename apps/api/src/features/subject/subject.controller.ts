import type { Request, Response } from "express";
import type { SubjectService } from "./subject.service";
import { NotFoundError, HttpStatus } from "../../utils";

export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  async create(req: Request, res: Response): Promise<void> {
    const subject = await this.subjectService.createSubject(req.body);

    res.status(HttpStatus.CREATED).json({
      success: true,
      data: subject,
    });
  }

  async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const subject = await this.subjectService.getSubjectById(id);

    if (!subject) {
      throw new NotFoundError("Subject not found", "SUBJECT_NOT_FOUND");
    }

    res.json({
      success: true,
      data: subject,
    });
  }

  async getAll(req: Request, res: Response): Promise<void> {
    const onlyActive = req.query.active === "true";

    const subjects = await this.subjectService.getAllSubjects({ onlyActive });

    res.json({
      success: true,
      data: subjects,
    });
  }

  async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const subject = await this.subjectService.updateSubject(id, req.body);

    res.json({
      success: true,
      data: subject,
    });
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await this.subjectService.deleteSubject(id);

    res.status(204).send();
  }
}
