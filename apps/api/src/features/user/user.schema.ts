import { z } from "zod";

export const createUserSchema = z.object({
  mobileNumber: z
    .string({ required_error: "Mobile number is required" })
    .min(10, "Mobile number must be at least 10 characters")
    .max(15, "Mobile number must be at most 15 characters"),
  name: z.string().max(100, "Name must be at most 100 characters").optional().nullable(),
  role: z.string().optional(),
});



export const userIdParamSchema = z.object({
  id: z.string().uuid("Invalid user ID format"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UserIdParam = z.infer<typeof userIdParamSchema>;
