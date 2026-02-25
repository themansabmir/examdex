import { Request, Response } from "express";
import { IUserService } from "./user.service";
import { CreateUserInputDTO, UpdateUserInputDTO } from "./user.dto";
import { HttpStatus } from "../../utils/app-error";
import { UserType } from "@prisma/client";

export class UserController {
  constructor(private readonly userService: IUserService) {}

  createUser = async (req: Request, res: Response): Promise<void> => {
    const input: CreateUserInputDTO = req.body;
    const result = await this.userService.createUser(input);

    res.status(HttpStatus.CREATED).json({
      success: true,
      data: result,
    });
  };

  getUserById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const result = await this.userService.getUserById(id);

    res.status(HttpStatus.OK).json({
      success: true,
      data: result,
    });
  };

  getAllUsers = async (req: Request, res: Response): Promise<void> => {
    const { userType, onlyActive, excludeStudent } = req.query;

    const result = await this.userService.getAllUsers({
      userType: userType as UserType | UserType[] | undefined,
      onlyActive: onlyActive === "true",
      excludeStudent: excludeStudent === "true",
    });

    res.status(HttpStatus.OK).json({
      success: true,
      data: result,
    });
  };

  updateUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const input: UpdateUserInputDTO = req.body;
    const result = await this.userService.updateUser(id, input);

    res.status(HttpStatus.OK).json({
      success: true,
      data: result,
    });
  };

  deleteUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await this.userService.deleteUser(id);

    res.status(HttpStatus.NO_CONTENT).send();
  };

  getMe = async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user.userId;
    const result = await this.userService.getMe(userId);

    res.status(HttpStatus.OK).json({
      success: true,
      data: result,
    });
  };

  updateMe = async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user.userId;
    const input: UpdateUserInputDTO = req.body;
    const result = await this.userService.updateMe(userId, input);

    res.status(HttpStatus.OK).json({
      success: true,
      data: result,
    });
  };
}
