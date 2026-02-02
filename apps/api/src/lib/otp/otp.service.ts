import crypto from "crypto";
import { IOtpRepository } from "./otp.repository";
import { OtpConfig, OtpResult, OtpVerificationResult, OtpChannel } from "./otp.types";
import { TwilioService } from "../twilio";
import { SmtpService } from "../smtp";

export class OtpService {
  private config: OtpConfig;
  private repository: IOtpRepository;
  private twilioService?: TwilioService;
  private smtpService?: SmtpService;

  constructor(
    config: OtpConfig,
    repository: IOtpRepository,
    twilioService?: TwilioService,
    smtpService?: SmtpService
  ) {
    this.config = config;
    this.repository = repository;
    this.twilioService = twilioService;
    this.smtpService = smtpService;
  }

  /**
   * Generate OTP code
   */
  private generateCode(): string {
    const digits = "0123456789";
    let code = "";
    const randomBytes = crypto.randomBytes(this.config.length);

    for (let i = 0; i < this.config.length; i++) {
      code += digits[randomBytes[i] % digits.length];
    }

    return code;
  }

  /**
   * Generate and send OTP
   */
  async generateAndSend(
    userId: string,
    channel: OtpChannel,
    recipient: string
  ): Promise<OtpResult> {
    try {
      // Rate limiting: Check recent OTP generation attempts
      const recentAttempts = await this.repository.getRecentGenerationCount(userId, 15);
      if (recentAttempts >= 3) {
        return {
          success: false,
          error: "Too many OTP requests. Please try again after 15 minutes.",
        };
      }

      // Generate OTP
      const code = this.generateCode();
      const expiresAt = new Date(Date.now() + this.config.expiresInMinutes * 60 * 1000);

      // Save to repository
      await this.repository.save(userId, channel, {
        code,
        expiresAt,
        attempts: 0,
        verified: false,
      });

      // Send via appropriate channel
      let sendResult: { success: boolean; error?: string };

      if (channel === OtpChannel.SMS) {
        sendResult = await this.sendViaSms(recipient, code);
      } else if (channel === OtpChannel.EMAIL) {
        sendResult = await this.sendViaEmail(recipient, code);
      } else {
        return {
          success: false,
          error: "Invalid channel",
        };
      }

      if (!sendResult.success) {
        // If primary channel fails, try fallback
        const fallbackResult = await this.sendFallback(channel, recipient, code);
        if (!fallbackResult.success) {
          return {
            success: false,
            error: `Failed to send OTP: ${sendResult.error}`,
          };
        }
      }

      return {
        success: true,
        expiresAt,
        // Only include code in development for testing
        ...(process.env.NODE_ENV === "development" && { code }),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate OTP",
      };
    }
  }

  /**
   * Send OTP via SMS (Twilio)
   */
  private async sendViaSms(
    phoneNumber: string,
    code: string
  ): Promise<{ success: boolean; error?: string }> {
    if (!this.twilioService) {
      return { success: false, error: "SMS service not configured" };
    }

    const result = await this.twilioService.sendOtpSms(
      phoneNumber,
      code,
      this.config.expiresInMinutes
    );
    return { success: result.success, error: result.error };
  }

  /**
   * Send OTP via Email (SMTP)
   */
  private async sendViaEmail(
    email: string,
    code: string
  ): Promise<{ success: boolean; error?: string }> {
    if (!this.smtpService) {
      return { success: false, error: "Email service not configured" };
    }

    const result = await this.smtpService.sendOtpEmail(email, code, this.config.expiresInMinutes);
    return { success: result.success, error: result.error };
  }

  /**
   * Fallback mechanism: SMS -> Email, Email -> SMS
   */
  private async sendFallback(
    primaryChannel: OtpChannel,
    recipient: string,
    code: string
  ): Promise<{ success: boolean; error?: string }> {
    if (primaryChannel === OtpChannel.SMS && this.smtpService) {
      // Try email as fallback
      return this.sendViaEmail(recipient, code);
    } else if (primaryChannel === OtpChannel.EMAIL && this.twilioService) {
      // Try SMS as fallback
      return this.sendViaSms(recipient, code);
    }

    return { success: false, error: "No fallback available" };
  }

  /**
   * Verify OTP code
   */
  async verify(userId: string, channel: OtpChannel, code: string): Promise<OtpVerificationResult> {
    try {
      const otpData = await this.repository.get(userId, channel);

      if (!otpData) {
        return {
          success: false,
          error: "OTP not found or expired",
        };
      }

      // Check if already verified
      if (otpData.verified) {
        return {
          success: false,
          error: "OTP already used",
        };
      }

      // Check expiration
      if (new Date() > otpData.expiresAt) {
        await this.repository.delete(userId, channel);
        return {
          success: false,
          error: "OTP expired",
        };
      }

      // Check max attempts
      if (otpData.attempts >= this.config.maxAttempts) {
        await this.repository.delete(userId, channel);
        return {
          success: false,
          error: "Maximum verification attempts exceeded",
        };
      }

      // Verify code using bcrypt comparison
      const isValid = await this.repository.verify(userId, channel, code);

      if (!isValid) {
        await this.repository.incrementAttempts(userId, channel);
        const attemptsRemaining = this.config.maxAttempts - (otpData.attempts + 1);

        return {
          success: false,
          error: "Invalid OTP code",
          attemptsRemaining: Math.max(0, attemptsRemaining),
        };
      }

      // Mark as verified
      otpData.verified = true;
      otpData.code = code; // Set code for saving (will be hashed in repository)
      await this.repository.save(userId, channel, otpData);

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Verification failed",
      };
    }
  }

  /**
   * Resend OTP
   */
  async resend(userId: string, channel: OtpChannel, recipient: string): Promise<OtpResult> {
    // Delete existing OTP
    await this.repository.delete(userId, channel);

    // Generate and send new OTP
    return this.generateAndSend(userId, channel, recipient);
  }

  /**
   * Clear OTP after successful verification
   */
  async clear(userId: string, channel: OtpChannel): Promise<void> {
    await this.repository.delete(userId, channel);
  }
}
