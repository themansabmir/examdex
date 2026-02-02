import twilio from "twilio";
import {
  TwilioConfig,
  SmsOptions,
  SmsResult,
  VerifyServiceConfig,
  VerificationResult,
} from "./twilio.types";
import { PhoneValidator } from "./phone-validator";

export class TwilioService {
  private client: ReturnType<typeof twilio>;
  private config: TwilioConfig;
  private verifyServiceSid?: string;

  constructor(config: TwilioConfig, verifyConfig?: VerifyServiceConfig) {
    this.config = config;
    this.client = twilio(config.accountSid, config.authToken);
    this.verifyServiceSid = verifyConfig?.serviceSid;
  }

  /**
   * Send SMS message
   */
  async sendSms(options: SmsOptions): Promise<SmsResult> {
    try {
      // Validate phone number
      const validation = PhoneValidator.validateAndFormat(options.to);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error || "Invalid phone number",
        };
      }

      const message = await this.client.messages.create({
        body: options.body,
        from: this.config.phoneNumber,
        to: validation.formatted!,
      });

      return {
        success: true,
        messageId: message.sid,
        status: message.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to send SMS",
      };
    }
  }

  /**
   * Send OTP via SMS
   */
  async sendOtpSms(to: string, otp: string, expiresInMinutes: number = 10): Promise<SmsResult> {
    const body = `Your ExamDex OTP is: ${otp}. Valid for ${expiresInMinutes} minutes. Do not share this code.`;
    return this.sendSms({ to, body });
  }

  /**
   * Send verification code using Twilio Verify API (recommended for production)
   */
  async sendVerificationCode(
    to: string,
    channel: "sms" | "call" = "sms"
  ): Promise<VerificationResult> {
    if (!this.verifyServiceSid) {
      return {
        success: false,
        error: "Twilio Verify service not configured",
      };
    }

    try {
      const verification = await this.client.verify.v2
        .services(this.verifyServiceSid)
        .verifications.create({ to, channel });

      return {
        success: true,
        status: verification.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to send verification code",
      };
    }
  }

  /**
   * Verify code using Twilio Verify API
   */
  async verifyCode(to: string, code: string): Promise<VerificationResult> {
    if (!this.verifyServiceSid) {
      return {
        success: false,
        error: "Twilio Verify service not configured",
      };
    }

    try {
      const verificationCheck = await this.client.verify.v2
        .services(this.verifyServiceSid)
        .verificationChecks.create({ to, code });

      return {
        success: verificationCheck.status === "approved",
        status: verificationCheck.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to verify code",
      };
    }
  }

  /**
   * Send bulk SMS (for notifications)
   */
  async sendBulkSms(recipients: string[], body: string): Promise<SmsResult[]> {
    const promises = recipients.map((to) => this.sendSms({ to, body }));
    return Promise.all(promises);
  }

  /**
   * Get message status
   */
  async getMessageStatus(messageSid: string): Promise<string | null> {
    try {
      const message = await this.client.messages(messageSid).fetch();
      return message.status;
    } catch (error) {
      console.error("Failed to fetch message status:", error);
      return null;
    }
  }
}
