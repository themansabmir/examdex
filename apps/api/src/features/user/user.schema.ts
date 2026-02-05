import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email("Invalid email format").optional(),
  phone: z.string().min(10, "Phone number must be at least 10 digits").optional(),
  fullName: z
    .string({ required_error: "Full name is required" })
    .min(1, "Full name cannot be empty")
    .max(255, "Full name must be at most 255 characters"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  userType: z.string({ required_error: "User type is required" }),
  isActive: z.boolean().optional(),
});

export const updateUserSchema = z.object({
  fullName: z.string().min(1).max(255).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(10).optional(),
  isActive: z.boolean().optional(),
  examId: z.string().uuid().optional(),
  isOnboarded: z.boolean().optional(),
});

export const userIdParamSchema = z.object({
  id: z.string().uuid("Invalid user ID format"),
});
