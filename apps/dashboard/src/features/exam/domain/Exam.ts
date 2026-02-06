import { z } from "zod";

export const CreateExamSchema = z.object({
  examCode: z
    .string({ required_error: "Exam code is required" })
    .max(50, "Exam code must be at most 50 characters")
    .regex(
      /^[A-Z0-9_-]+$/,
      "Exam code must contain only uppercase letters, numbers, underscores, and hyphens"
    ),
  examName: z
    .string({ required_error: "Exam name is required" })
    .max(255, "Exam name must be at most 255 characters"),
  examFullName: z.string().max(1000, "Exam full name must be at most 1000 characters").optional(),
  examBoard: z.string().max(100, "Exam board must be at most 100 characters").optional(),
  isPopular: z.boolean().optional().default(false),
});

export const UpdateExamSchema = CreateExamSchema.extend({
  examCode: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type CreateExamInput = z.infer<typeof CreateExamSchema>;
export type UpdateExamInput = z.infer<typeof UpdateExamSchema>;
export type ExamFormInput = CreateExamInput & { isActive?: boolean };

export interface Exam {
  id: string;
  examCode: string;
  examName: string;
  examFullName: string | null;
  examBoard: string | null;
  isActive: boolean;
  isPopular: boolean;
  createdAt: string;
  updatedAt: string;
}
