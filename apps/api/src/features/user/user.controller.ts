import { Request, Response } from "express";
import { IUserService } from "./user.service";
import { CreateUserInputDTO, UpdateUserInputDTO } from "./user.dto";
import { HttpStatus } from "../../utils/app-error";
import { asyncHandler } from "../../utils/async-handler";
import { UnauthorizedError } from "../../utils";
import { UserListQueryInput } from "./user.schema";

export class UserController {
  constructor(private readonly userService: IUserService) {}

  createUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const input: CreateUserInputDTO = req.body;
    const result = await this.userService.createUser(input);

    res.status(HttpStatus.CREATED).json({
      success: true,
      data: result,
    });
  });

  getUserById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const result = await this.userService.getUserById(id);

    res.status(HttpStatus.OK).json({
      success: true,
      data: result,
    });
  });

  getAllUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const query = req.query as unknown as UserListQueryInput;

    const result = await this.userService.getAllUsers({
      userType: query.userType,
      onlyActive: query.onlyActive,
      excludeStudent: query.excludeStudent,
    });

    res.status(HttpStatus.OK).json({
      success: true,
      data: result,
    });
  });

  updateUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const input: UpdateUserInputDTO = req.body;
    const result = await this.userService.updateUser(id, input);

    res.status(HttpStatus.OK).json({
      success: true,
      data: result,
    });
  });

  deleteUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await this.userService.deleteUser(id);

    res.status(HttpStatus.NO_CONTENT).send();
  });

  getMe = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = this.getAuthenticatedUserId(req);
    const result = await this.userService.getMe(userId);

    res.status(HttpStatus.OK).json({
      success: true,
      data: result,
    });
  });

  updateMe = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = this.getAuthenticatedUserId(req);
    const input: UpdateUserInputDTO = req.body;
    const result = await this.userService.updateMe(userId, input);

    res.status(HttpStatus.OK).json({
      success: true,
      data: result,
    });
  });

  private getAuthenticatedUserId(req: Request): string {
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedError("Unauthorized", "UNAUTHORIZED");
    }

    return userId;
  }
}
