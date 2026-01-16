import { z } from "zod";

export const createUserSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format")
    .max(255, "Email must be at most 255 characters"),
  name: z.string().max(100, "Name must be at most 100 characters").optional().nullable(),
});

export const userIdParamSchema = z.object({
  id: z.string().uuid("Invalid user ID format"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UserIdParam = z.infer<typeof userIdParamSchema>;
