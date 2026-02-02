export interface TwilioConfig {
  accountSid: string;
  authToken: string;
  phoneNumber: string;
}

export interface SmsOptions {
  to: string;
  body: string;
}

export interface SmsResult {
  success: boolean;
  messageId?: string;
  error?: string;
  status?: string;
}

export interface VerifyServiceConfig {
  serviceSid: string;
}

export interface VerificationResult {
  success: boolean;
  status?: string;
  error?: string;
}
