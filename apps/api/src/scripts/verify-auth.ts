/* eslint-disable no-console */

import { AuthService } from "../features/auth/auth.service";
import { OtpService } from "../otp/otp.service";
import { InMemoryUserRepository } from "../features/user/user.repository";
import { IOtpRepository, Otp } from "../otp/otp.repository";

// Mock OTP Repository
class MockOtpRepository implements IOtpRepository {
    private otps: Map<string, Otp> = new Map();

    async save(otp: Omit<Otp, "id" | "createdAt">): Promise<Otp> {
        const newOtp: Otp = {
            ...otp,
            id: "mock-id",
            createdAt: new Date(),
        };
        this.otps.set(otp.mobileNumber, newOtp);
        console.log(`[MockRepo] Saved OTP for ${otp.mobileNumber}: ${otp.code}`);
        return newOtp;
    }

    async findLatest(mobileNumber: string, code: string): Promise<Otp | null> {
        const otp = this.otps.get(mobileNumber);
        if (otp && otp.code === code && otp.expiresAt > new Date()) {
            return otp;
        }
        return null;
    }

    async deleteByMobileNumber(mobileNumber: string): Promise<void> {
        this.otps.delete(mobileNumber);
    }

    shouldUseProviderVerification(): boolean {
        return false;
    }

    async sendSms(to: string, message: string): Promise<void> {
        console.log(`[MockRepo] Sending SMS to ${to}: ${message}`);
    }

    async sendVerify(_to: string, _channel?: "sms" | "call"): Promise<void> {
        // No-op
    }

    async checkVerify(_to: string, _code: string): Promise<boolean> {
        return true; // Mock success
    }
}

async function main() {
    console.log("--- Starting Auth Verification ---");

    // Setup Dependencies
    const userRepository = new InMemoryUserRepository();
    const otpRepository = new MockOtpRepository();
    const otpService = new OtpService(otpRepository);
    const authService = new AuthService(userRepository, otpService);

    const mobileNumber = "1234567890";

    // 1. Send OTP
    console.log(`\n1. Sending OTP to ${mobileNumber}...`);
    const sendResult = await authService.sendOtp(mobileNumber);
    console.log("Send Result:", sendResult);

    // In our mock, the code is generated in OtpService. 
    // We can peek into the MockRepo or just grab the code if returned.
    // OtpService returns { message, code? } (code if dev mode).
    // But wait, OtpService uses `new Date` and `Math.random`.
    // To verify verification, we need to know the code.
    // OtpService implementation:
    // if (env.isDevelopment) returns code.
    // Let's assume we can get it from the logs of MockRepo.
    // Since I can't easily parse logs here, I'll rely on the return value if dev mode is on, 
    // or I need to modify MockRepo to store it publicly.

    // Actually, I can cheat in the test and just find the code from the repo.
    // @ts-ignore
    const storedOtp = otpRepository.otps.get(mobileNumber);
    if (!storedOtp) {
        console.error("❌ OTP not found in repo!");
        process.exit(1);
    }
    const code = storedOtp.code;
    console.log(`found OTP code: ${code}`);

    // 2. Verify OTP
    console.log(`\n2. Verifying OTP with code ${code}...`);
    try {
        const verifyResult = await authService.verifyOtp(mobileNumber, code);
        console.log("Verify Result:", verifyResult);

        if (verifyResult.token && verifyResult.user) {
            console.log("✅ Verification Successful! Token generated.");
            console.log("User:", verifyResult.user);
        } else {
            console.error("❌ Verification failed: No token returned.");
        }
    } catch (error) {
        console.error("❌ Verification failed with error:", error);
    }
}

main().catch(console.error);
