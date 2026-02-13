import { Request, Response, CookieOptions } from "express";
import { IAuthService } from "./auth.service";
import {
  AdminLoginInputDTO,
  StudentAuthInputDTO,
  VerifyOtpInputDTO,
  RefreshTokenInputDTO,
} from "./auth.dto";
import { HttpStatus } from "../../utils/app-error";

export class AuthController {
  private readonly cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
    ...(process.env.COOKIE_DOMAIN && { domain: process.env.COOKIE_DOMAIN }),
  };

  constructor(private readonly authService: IAuthService) {}

  adminLogin = async (req: Request, res: Response): Promise<void> => {
    const input: AdminLoginInputDTO = req.body;
    const result = await this.authService.adminLogin(input);

    res.cookie("refreshToken", result.refreshToken, this.cookieOptions);

    res.status(HttpStatus.OK).json({
      success: true,
      data: {
        accessToken: result.accessToken,
        user: result.user,
      },
    });
  };

  studentAuth = async (req: Request, res: Response): Promise<void> => {
    const input: StudentAuthInputDTO = req.body;
    const result = await this.authService.studentAuth(input);

    res.status(HttpStatus.OK).json({
      success: true,
      data: result,
    });
  };

  verifyOtp = async (req: Request, res: Response): Promise<void> => {
    const input: VerifyOtpInputDTO = req.body;
    const result = await this.authService.verifyOtp(input);

    res.cookie("refreshToken", result.refreshToken, this.cookieOptions);

    res.status(HttpStatus.OK).json({
      success: true,
      data: {
        accessToken: result.accessToken,
        user: result.user,
      },
    });
  };

  refreshToken = async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Refresh token not provided",
      });
      return;
    }

    const input: RefreshTokenInputDTO = { refreshToken };
    const result = await this.authService.refreshToken(input);

    res.cookie("refreshToken", result.refreshToken, this.cookieOptions);

    res.status(HttpStatus.OK).json({
      success: true,
      data: {
        accessToken: result.accessToken,
        user: result.user,
      },
    });
  };

  logout = async (_: Request, res: Response): Promise<void> => {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      ...(process.env.COOKIE_DOMAIN && { domain: process.env.COOKIE_DOMAIN }),
    });

    res.status(HttpStatus.OK).json({
      success: true,
      message: "Logged out successfully",
    });
  };

  inviteAdmin = async (req: Request, res: Response): Promise<void> => {
    const invitedBy = (req as any).user?.id;
    await this.authService.inviteAdmin(req.body, invitedBy);

    res.status(HttpStatus.OK).json({
      success: true,
      message: "Invitation sent successfully",
    });
  };

  acceptInvite = async (req: Request, res: Response): Promise<void> => {
    const result = await this.authService.acceptInvite(req.body);

    res.cookie("refreshToken", result.refreshToken, this.cookieOptions);

    res.status(HttpStatus.CREATED).json({
      success: true,
      data: {
        accessToken: result.accessToken,
        user: result.user,
      },
    });
  };

  requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
    await this.authService.requestPasswordReset(req.body);

    res.status(HttpStatus.OK).json({
      success: true,
      message: "If an account exists with this email, a reset link has been sent.",
    });
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    await this.authService.resetPassword(req.body);

    res.status(HttpStatus.OK).json({
      success: true,
      message: "Password reset successfully",
    });
  };
}
