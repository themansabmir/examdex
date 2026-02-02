export interface OtpConfig {
  length: number;
  expiresInMinutes: number;
  maxAttempts: number;
}

export interface OtpData {
  code: string;
  expiresAt: Date;
  attempts: number;
  verified: boolean;
}

export interface OtpResult {
  success: boolean;
  code?: string;
  expiresAt?: Date;
  error?: string;
}

export interface OtpVerificationResult {
  success: boolean;
  error?: string;
  attemptsRemaining?: number;
}

export enum OtpChannel {
  SMS = "sms",
  EMAIL = "email",
}
