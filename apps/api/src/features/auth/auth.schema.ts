import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format")
    .max(255, "Email must be at most 255 characters"),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be at most 100 characters"),
});

export const studentAuthSchema = z.object({
  phoneOrEmail: z
    .string({ required_error: "Phone number or email is required" })
    .min(1, "Phone number or email cannot be empty"),
  countryCode: z.string().optional().default("+91"),
});

export const verifyOtpSchema = z.object({
  phoneOrEmail: z
    .string({ required_error: "Phone number or email is required" })
    .min(1, "Phone number or email cannot be empty"),
  otp: z
    .string({ required_error: "OTP is required" })
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only digits"),
  countryCode: z.string().optional().default("+91"),
});

export const refreshTokenSchema = z.object({
  refreshToken: z
    .string({ required_error: "Refresh token is required" })
    .min(1, "Refresh token cannot be empty"),
});
