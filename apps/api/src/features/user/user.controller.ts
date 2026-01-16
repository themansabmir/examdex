import type { Request, Response } from "express";
import type { UserService } from "./user.service";
import { NotFoundError, HttpStatus } from "../../utils";

export class UserController {
  constructor(private readonly userService: UserService) {}

  async create(req: Request, res: Response): Promise<void> {
    const { email, name } = req.body;
    const user = await this.userService.createUser({ email, name });

    res.status(HttpStatus.CREATED).json({
      success: true,
      data: user,
    });
  }

  async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const user = await this.userService.getUserById(id);

    if (!user) {
      throw new NotFoundError("User not found", "USER_NOT_FOUND");
    }

    res.json({
      success: true,
      data: user,
    });
  }

  async getAll(_req: Request, res: Response): Promise<void> {
    const users = await this.userService.getAllUsers();

    res.json({
      success: true,
      data: users,
    });
  }
}
