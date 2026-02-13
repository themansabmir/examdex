import fs from "fs";
import path from "path";

export class EmailTemplates {
  private static cache = new Map<string, string>();

  /**
   * Load and cache email template
   */
  private static loadTemplate(templateName: string): string {
    if (this.cache.has(templateName)) {
      return this.cache.get(templateName)!;
    }

    const templatePath = path.join(__dirname, `${templateName}.html`);
    const template = fs.readFileSync(templatePath, "utf-8");
    this.cache.set(templateName, template);
    return template;
  }

  /**
   * Get OTP email HTML
   */
  static getOtpEmail(otp: string, expiresInMinutes: number): string {
    const template = this.loadTemplate("otp-email");
    return template
      .replace("{{OTP_CODE}}", otp)
      .replace("{{EXPIRES_IN}}", expiresInMinutes.toString());
  }

  /**
   * Get welcome email HTML
   */
  static getWelcomeEmail(userName: string, appUrl: string = "https://examdex.com"): string {
    const template = this.loadTemplate("welcome-email");
    return template.replace("{{USER_NAME}}", userName).replace("{{APP_URL}}", appUrl);
  }

  /**
   * Get invitation email HTML
   */
  static getInvitationEmail(inviteLink: string, role: string): string {
    const template = this.loadTemplate("invitation-email");
    return template.replace("{{INVITE_LINK}}", inviteLink).replace("{{ROLE}}", role);
  }

  /**
   * Get reset password email HTML
   */
  static getResetPasswordEmail(resetLink: string): string {
    const template = this.loadTemplate("reset-password-email");
    return template.replace("{{RESET_LINK}}", resetLink);
  }
}
