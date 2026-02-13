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

export const inviteAdminSchema = z.object({
  email: z.string().email("Invalid email format"),
  role: z.enum(["admin", "content_manager", "support"]),
});

export const acceptInviteSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(1, "Full name is required"),
});

export const resetPasswordRequestSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
