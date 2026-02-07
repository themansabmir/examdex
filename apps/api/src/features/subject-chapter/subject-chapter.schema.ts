import { z } from "zod";

export const createSubjectChapterSchema = z.object({
  examSubjectId: z
    .string({ required_error: "Exam-Subject ID is required" })
    .uuid("Invalid exam-subject ID format"),
  chapterId: z
    .string({ required_error: "Chapter ID is required" })
    .uuid("Invalid chapter ID format"),
  chapterNumber: z.number().int().positive("Chapter number must be positive").optional(),
  weightagePercentage: z
    .number({ required_error: "Weightage percentage is required" })
    .min(0, "Weightage must be between 0 and 100")
    .max(100, "Weightage must be between 0 and 100"),
});

export const updateSubjectChapterSchema = z.object({
  chapterNumber: z.number().int().positive("Chapter number must be positive").optional(),
  weightagePercentage: z
    .number()
    .min(0, "Weightage must be between 0 and 100")
    .max(100, "Weightage must be between 0 and 100")
    .optional(),
  isActive: z.boolean().optional(),
});

export const subjectChapterIdParamSchema = z.object({
  id: z.string().uuid("Invalid subject-chapter ID format"),
});

// Renamed to avoid conflict with exam-subject.ts
export const subjectChapterExamSubjectIdParamSchema = z.object({
  examSubjectId: z.string().uuid("Invalid exam-subject ID format"),
});

// Renamed to avoid conflict with chapter.ts
export const subjectChapterChapterIdParamSchema = z.object({
  chapterId: z.string().uuid("Invalid chapter ID format"),
});



export type CreateSubjectChapterInput = z.infer<typeof createSubjectChapterSchema>;
export type UpdateSubjectChapterInput = z.infer<typeof updateSubjectChapterSchema>;
export type SubjectChapterIdParam = z.infer<typeof subjectChapterIdParamSchema>;
