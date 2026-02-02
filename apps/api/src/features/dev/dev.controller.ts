import { Request, Response } from "express";
import { IUserService } from "../user/user.service";
import { IUserRepository } from "../user/user.repository";
import { HttpStatus } from "../../utils/app-error";

export class DevController {
  constructor(
    private readonly userService: IUserService,
    private readonly userRepository: IUserRepository
  ) {}

  seedAdmin = async (_req: Request, res: Response): Promise<void> => {
    if (process.env.NODE_ENV === "production") {
      res.status(HttpStatus.FORBIDDEN).json({
        success: false,
        message: "This endpoint is only available in development mode",
      });
      return;
    }

    // Check if admin already exists
    const existingAdmin = await this.userRepository.findByEmail("admin@examdex.com");

    if (existingAdmin) {
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Admin user already exists",
        data: {
          email: existingAdmin.email,
          fullName: existingAdmin.fullName,
          userType: existingAdmin.userType,
        },
      });
      return;
    }

    // Create admin user
    const admin = await this.userService.createUser({
      email: "admin@examdex.com",
      fullName: "Admin User",
      password: "password123",
      userType: "admin",
      isActive: true,
    });

    res.status(HttpStatus.CREATED).json({
      success: true,
      message: "Admin user created successfully",
      data: {
        email: admin.email,
        fullName: admin.fullName,
        userType: admin.userType,
        credentials: {
          email: "admin@examdex.com",
          password: "password123",
        },
      },
    });
  };
}
