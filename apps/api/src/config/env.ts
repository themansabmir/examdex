import dotenv from "dotenv";

dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "3001", 10),
  DATABASE_URL: process.env.DATABASE_URL || "",

  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",

  // JWT
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "your-access-secret-key",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key",
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",

  // SMTP (Nodemailer)
  SMTP_HOST: process.env.SMTP_HOST || "smtp.gmail.com",
  SMTP_PORT: parseInt(process.env.SMTP_PORT || "587", 10),
  SMTP_SECURE: process.env.SMTP_SECURE === "true",
  SMTP_USER: process.env.SMTP_USER || "",
  SMTP_PASS: process.env.SMTP_PASS || "",
  SMTP_FROM_NAME: process.env.SMTP_FROM_NAME || "ExamDex",
  SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL || "noreply@examdex.com",

  // Twilio
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || "",
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || "",
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER || "",
  TWILIO_VERIFY_SERVICE_SID: process.env.TWILIO_VERIFY_SERVICE_SID || "",

  // OTP Configuration
  OTP_LENGTH: parseInt(process.env.OTP_LENGTH || "6", 10),
  OTP_EXPIRES_IN_MINUTES: parseInt(process.env.OTP_EXPIRES_IN_MINUTES || "10", 10),
  OTP_MAX_ATTEMPTS: parseInt(process.env.OTP_MAX_ATTEMPTS || "3", 10),

  // Rate limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10), // 15 minutes
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),

  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",
} as const;

export function validateEnv(): void {
  const required = ["DATABASE_URL"];

  const productionRequired = [
    "JWT_ACCESS_SECRET",
    "JWT_REFRESH_SECRET",
    "SMTP_USER",
    "SMTP_PASS",
    "TWILIO_ACCOUNT_SID",
    "TWILIO_AUTH_TOKEN",
    "TWILIO_PHONE_NUMBER",
  ];

  const missing = required.filter((key) => !process.env[key]);
  const missingProduction = env.isProduction
    ? productionRequired.filter((key) => !process.env[key])
    : [];

  if (missing.length > 0 && env.isProduction) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  if (missingProduction.length > 0) {
    console.warn(`⚠️  Missing production environment variables: ${missingProduction.join(", ")}`);
  }

  if (missing.length > 0) {
    console.warn(`⚠️  Missing environment variables: ${missing.join(", ")}`);
  }
}
