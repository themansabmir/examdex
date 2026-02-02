import type { Request, Response } from "express";
import type { AuthService } from "./auth.service";

export class AuthController {
    constructor(private readonly authService: AuthService) { }

    async sendOtp(req: Request, res: Response): Promise<void> {
        const { mobileNumber } = req.body;
        const result = await this.authService.sendOtp(mobileNumber);

        res.json({
            success: true,
            data: result,
        });
    }

    async verifyOtp(req: Request, res: Response): Promise<void> {
        const { mobileNumber, code } = req.body;
        const result = await this.authService.verifyOtp(mobileNumber, code);

        res.json({
            success: true,
            data: result,
        });
    }
}
