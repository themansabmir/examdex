import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export interface AuthUser {
  id: string;
  email: string | null;
  fullName: string;
  userType: string;
  roles: string[];
}

export interface AuthResponseData {
  accessToken: string;
  user: AuthUser;
}

export interface AuthResponse {
  success: boolean;
  data: AuthResponseData;
}

export const InviteAdminSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "content_manager", "support"]),
});

export type InviteAdminInput = z.infer<typeof InviteAdminSchema>;

export const AcceptInviteSchema = z.object({
  token: z.string(),
  fullName: z.string().min(1, "Full name is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type AcceptInviteInput = z.infer<typeof AcceptInviteSchema>;

export const ResetPasswordRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type ResetPasswordRequestInput = z.infer<typeof ResetPasswordRequestSchema>;

export const ResetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
