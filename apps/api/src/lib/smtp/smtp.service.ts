import nodemailer, { Transporter } from "nodemailer";
import { EmailConfig, EmailOptions, EmailResult } from "./smtp.types";
import { EmailTemplates } from "./templates";

export class SmtpService {
  private transporter: Transporter;
  private config: EmailConfig;

  constructor(config: EmailConfig) {
    this.config = config;
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.auth.user,
        pass: config.auth.pass,
      },
    });
  }

  /**
   * Send email
   */
  async sendEmail(options: EmailOptions): Promise<EmailResult> {
    try {
      const mailOptions = {
        from: `"${this.config.from.name}" <${this.config.from.email}>`,
        to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        cc: options.cc,
        bcc: options.bcc,
        attachments: options.attachments,
      };

      const info = await this.transporter.sendMail(mailOptions);

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to send email",
      };
    }
  }

  /**
   * Send OTP email
   */
  async sendOtpEmail(to: string, otp: string, expiresInMinutes: number = 10): Promise<EmailResult> {
    const html = EmailTemplates.getOtpEmail(otp, expiresInMinutes);

    return this.sendEmail({
      to,
      subject: "Your OTP Code",
      html,
      text: `Your OTP code is: ${otp}. It will expire in ${expiresInMinutes} minutes.`,
    });
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(to: string, name: string, appUrl?: string): Promise<EmailResult> {
    const html = EmailTemplates.getWelcomeEmail(name, appUrl);

    return this.sendEmail({
      to,
      subject: "Welcome to ExamDex!",
      html,
      text: `Hi ${name}, Welcome to ExamDex! We're excited to have you on board.`,
    });
  }

  /**
   * Send invitation email
   */
  async sendInvitationEmail(to: string, inviteLink: string, role: string): Promise<EmailResult> {
    const html = EmailTemplates.getInvitationEmail(inviteLink, role);

    return this.sendEmail({
      to,
      subject: "You're invited to join ExamDex",
      html,
      text: `You have been invited to join ExamDex as a ${role}. Follow this link to set up your account: ${inviteLink}`,
    });
  }

  /**
   * Send reset password email
   */
  async sendResetPasswordEmail(to: string, resetLink: string): Promise<EmailResult> {
    const html = EmailTemplates.getResetPasswordEmail(resetLink);

    return this.sendEmail({
      to,
      subject: "Reset your ExamDex password",
      html,
      text: `Please use the following link to reset your password: ${resetLink}`,
    });
  }

  /**
   * Verify SMTP connection
   */
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error("SMTP connection failed:", error);
      return false;
    }
  }
}
