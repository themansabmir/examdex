import { Request, Response } from "express";
import { SubjectService } from "./subject.service";

export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  async create(req: Request, res: Response) {
    try {
      const subject = await this.subjectService.createSubject(req.body);
      res.status(201).json(subject);
    } catch (e: unknown) {
      this.handleError(e as Error, res);
    }
  }

  async getAll(_: Request, res: Response) {
    const subjects = await this.subjectService.getAllSubjects();
    res.json(subjects);
  }

  async getById(req: Request, res: Response) {
    try {
      const subject = await this.subjectService.getSubjectById(req.params.id);
      res.json(subject);
    } catch (e: unknown) {
      this.handleError(e as Error, res);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const subject = await this.subjectService.updateSubject(req.params.id, req.body);
      res.json(subject);
    } catch (e: unknown) {
      this.handleError(e as Error, res);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await this.subjectService.deleteSubject(req.params.id);
      res.status(204).send();
    } catch (e: unknown) {
      this.handleError(e as Error, res);
    }
  }

  private handleError(error: Error, res: Response) {
    if (error.message.includes("not found")) {
      res.status(404).json({ error: error.message });
      return;
    }
    if (error.message.includes("exists")) {
      res.status(409).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Internal server error" });
  }
}
