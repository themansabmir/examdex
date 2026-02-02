import { z } from "zod";

export const createSubjectSchema = z.object({
  subjectCode: z
    .string({ required_error: "Subject code is required" })
    .max(50, "Subject code must be at most 50 characters")
    .regex(
      /^[A-Z0-9_-]+$/,
      "Subject code must contain only uppercase letters, numbers, underscores, and hyphens"
    ),
  subjectName: z
    .string({ required_error: "Subject name is required" })
    .max(255, "Subject name must be at most 255 characters"),
});

export const updateSubjectSchema = z.object({
  subjectName: z.string().max(255, "Subject name must be at most 255 characters").optional(),
  isActive: z.boolean().optional(),
});

export const subjectIdParamSchema = z.object({
  id: z.string().uuid("Invalid subject ID format"),
});

export type CreateSubjectInput = z.infer<typeof createSubjectSchema>;
export type UpdateSubjectInput = z.infer<typeof updateSubjectSchema>;
export type SubjectIdParam = z.infer<typeof subjectIdParamSchema>;
