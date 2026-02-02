import { env } from "../config";

import { IOtpRepository } from "./otp.repository";

export class OtpService {
  constructor(private readonly otpRepository: IOtpRepository) { }

  async sendOtp(mobileNumber: string) {
    if (this.otpRepository.shouldUseProviderVerification()) {
      // Use repository for Verify API
      try {
        await this.otpRepository.sendVerify(mobileNumber);
        return { message: "OTP sent successfully" };
      } catch (error) {
        // Already logged in repo, but we can add service context if needed
        throw error;
      }
    }

    // Fallback to manual OTP generation and Database save
    await this.otpRepository.deleteByMobileNumber(mobileNumber);

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await this.otpRepository.save({
      mobileNumber,
      code,
      expiresAt
    });

    try {
      await this.otpRepository.sendSms(mobileNumber, `Your ExamDex OTP is: ${code}`);
    } catch (error) {
      // Logged in repo
    }

    return {
      message: "OTP sent successfully",
      code: env.isDevelopment ? code : undefined,
    };
  }

  /* ========= VERIFY OTP ========= */
  async verifyOtp(mobileNumber: string, code: string): Promise<boolean> {
    if (this.otpRepository.shouldUseProviderVerification()) {
      return await this.otpRepository.checkVerify(mobileNumber, code);
    }

    const otp = await this.otpRepository.findLatest(mobileNumber, code);

    if (otp) {
      await this.otpRepository.deleteByMobileNumber(mobileNumber);
      return true;
    }

    return false;
  }
}
