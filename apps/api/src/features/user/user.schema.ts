import { z } from "zod";
import { UserType } from "@prisma/client";

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

export const updateProfileSchema = z.object({
  fullName: z.string().min(1).max(255).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(10).optional(),
});

const booleanQuerySchema = z.preprocess((value) => {
  if (value === "true") return true;
  if (value === "false") return false;
  return value;
}, z.boolean().default(false));

export const userListQuerySchema = z.object({
  userType: z
    .preprocess(
      (value) => {
        if (value === undefined) return undefined;
        return Array.isArray(value) ? value : [value];
      },
      z.array(z.nativeEnum(UserType)).optional()
    )
    .optional(),
  onlyActive: booleanQuerySchema,
  excludeStudent: booleanQuerySchema,
});

export type UserListQueryInput = z.infer<typeof userListQuerySchema>;
