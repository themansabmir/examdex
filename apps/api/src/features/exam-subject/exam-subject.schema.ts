import { z } from "zod";

export const createExamSubjectSchema = z.object({
  examId: z.string({ required_error: "Exam ID is required" }).uuid("Invalid exam ID format"),
  subjectId: z
    .string({ required_error: "Subject ID is required" })
    .uuid("Invalid subject ID format"),
  displayOrder: z.number().int().positive("Display order must be positive").optional(),
});

export const createBulkExamSubjectSchema = z.object({
  examId: z.string({ required_error: "Exam ID is required" }).uuid("Invalid exam ID format"),
  items: z.array(
    z.object({
      subjectId: z
        .string({ required_error: "Subject ID is required" })
        .uuid("Invalid subject ID format"),
      displayOrder: z.number().int().positive("Display order must be positive").optional(),
    })
  ).min(1, "At least one item is required"),
});

export const updateExamSubjectSchema = z.object({
  displayOrder: z.number().int().positive("Display order must be positive").optional(),
  isActive: z.boolean().optional(),
});

export const examSubjectIdParamSchema = z.object({
  id: z.string().uuid("Invalid exam-subject ID format"),
});

// Renamed to avoid conflict with exam.ts and subject.ts
export const examSubjectExamIdParamSchema = z.object({
  examId: z.string().uuid("Invalid exam ID format"),
});

export const examSubjectSubjectIdParamSchema = z.object({
  subjectId: z.string().uuid("Invalid subject ID format"),
});



export type CreateExamSubjectInput = z.infer<typeof createExamSubjectSchema>;
export type CreateBulkExamSubjectInput = z.infer<typeof createBulkExamSubjectSchema>;
export type UpdateExamSubjectInput = z.infer<typeof updateExamSubjectSchema>;
export type ExamSubjectIdParam = z.infer<typeof examSubjectIdParamSchema>;
