import { z } from "zod";

export const createExamSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be at most 200 characters"),
  description: z
    .string()
    .max(1000, "Description must be at most 1000 characters")
    .optional()
    .nullable(),
  userId: z.string({ required_error: "User ID is required" }).uuid("Invalid user ID format"),
  duration: z
    .number()
    .int("Duration must be an integer")
    .min(1, "Duration must be at least 1 minute")
    .max(480, "Duration must be at most 480 minutes")
    .optional()
    .default(60),
  passingScore: z
    .number()
    .int("Passing score must be an integer")
    .min(0, "Passing score must be at least 0")
    .max(100, "Passing score must be at most 100")
    .optional()
    .default(70),
});

export const examIdParamSchema = z.object({
  id: z.string().uuid("Invalid exam ID format"),
});

export const publishExamSchema = z.object({
  userId: z.string({ required_error: "User ID is required" }).uuid("Invalid user ID format"),
});

export const userExamsParamSchema = z.object({
  userId: z.string().uuid("Invalid user ID format"),
});

export type CreateExamInput = z.infer<typeof createExamSchema>;
export type ExamIdParam = z.infer<typeof examIdParamSchema>;
export type PublishExamInput = z.infer<typeof publishExamSchema>;
export type UserExamsParam = z.infer<typeof userExamsParamSchema>;
