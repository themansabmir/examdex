import type { IUserRepository } from "../user/user.repository";
import { User } from "../user/user.entity";
import jwt from "jsonwebtoken";
import { env } from "../../config";
import { OtpService } from "../../otp/otp.service";

export class AuthService {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly otpService: OtpService
    ) { }

    async sendOtp(mobileNumber: string) {
        // Check if user exists, if not create one (auto-signup)
        let user = await this.userRepository.findByMobileNumber(mobileNumber);

        if (!user) {
            user = new User({
                mobileNumber,
                role: "student",
            });
            await this.userRepository.save(user);
        }

        // Delegate OTP sending to OtpService
        return await this.otpService.sendOtp(mobileNumber);
    }

    async verifyOtp(mobileNumber: string, code: string) {
        // 1. Verify OTP using OtpService
        const isValid = await this.otpService.verifyOtp(mobileNumber, code);

        if (!isValid) {
            throw new Error("Invalid or expired OTP");
        }

        // 2. Retrieve User
        const user = await this.userRepository.findByMobileNumber(mobileNumber);
        if (!user) {
            throw new Error("User not found");
        }

        // 3. Generate JWT
        const token = jwt.sign(
            { id: user.id, mobileNumber: user.mobileNumber!, role: user.role },
            env.JWT_SECRET,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            { expiresIn: env.JWT_EXPIRES_IN as any }
        );

        return {
            token,
            user: {
                id: user.id,
                mobileNumber: user.mobileNumber,
                name: user.name,
                role: user.role,
            },
        };
    }
}
