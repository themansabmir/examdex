import { Request, Response } from "express";
import { UserService } from "./user.service";

export class UserController {
  constructor(private readonly userService: UserService) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.userService.createUser(req.body);
      res.status(201).json(user);
    } catch (e: unknown) {
      res.status(400).json({ error: (e as Error).message });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    await this.userService.getAll(req, res);
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.userService.getById(req.params.id);
      res.json(user);
    } catch (e: unknown) {
      res.status(404).json({ error: (e as Error).message });
    }
  }
}
