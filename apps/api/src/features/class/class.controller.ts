import type { Request, Response } from "express";
import type { IClassService } from "./class.service";
import { HttpStatus, NotFoundError } from "../../utils";

export class ClassController {
  constructor(private readonly classService: IClassService) {}

  async createClass(req: Request, res: Response): Promise<void> {
    const classEntity = await this.classService.createClass(req.body);

    res.status(HttpStatus.CREATED).json({
      success: true,
      data: classEntity,
    });
  }

  async getClassById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const classEntity = await this.classService.getClassById(id);

    if (!classEntity) {
      throw new NotFoundError("Class not found", "CLASS_NOT_FOUND");
    }

    res.json({
      success: true,
      data: classEntity,
    });
  }

  async getClassByCode(req: Request, res: Response): Promise<void> {
    const { classCode } = req.params;
    const classEntity = await this.classService.getClassByCode(classCode);

    if (!classEntity) {
      throw new NotFoundError("Class not found", "CLASS_NOT_FOUND");
    }

    res.json({
      success: true,
      data: classEntity,
    });
  }

  async getAllClasses(req: Request, res: Response): Promise<void> {
    const onlyActive = req.query.active === "true";
    const classes = await this.classService.getAllClasses(onlyActive);

    res.json({
      success: true,
      data: classes,
    });
  }

  async updateClass(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const classEntity = await this.classService.updateClass(id, req.body);

    res.json({
      success: true,
      data: classEntity,
    });
  }

  async deleteClass(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await this.classService.deleteClass(id);

    res.status(HttpStatus.NO_CONTENT).send();
  }
}
