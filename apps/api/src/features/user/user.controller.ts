import type { Request, Response } from "express";
import type { UserService } from "./user.service";

export class UserController {
  constructor(private readonly userService: UserService) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { email, name } = req.body;

      if (!email) {
        res.status(400).json({
          error: "Missing required field: email is required",
        });
        return;
      }

      const user = await this.userService.createUser({ email, name });

      res.status(201).json({
        success: true,
        data: user,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("already exists")) {
          res.status(409).json({
            error: error.message,
          });
          return;
        }
      }

      res.status(500).json({
        error: "Internal server error",
      });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);

      if (!user) {
        res.status(404).json({
          error: "User not found",
        });
        return;
      }

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        error: "Internal server error",
      });
    }
  }

  async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();

      res.json({
        success: true,
        data: users,
      });
    } catch (error) {
      res.status(500).json({
        error: "Internal server error",
      });
    }
  }
}
