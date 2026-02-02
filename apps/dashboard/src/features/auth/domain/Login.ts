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
