import { z } from "zod";

export const createChapterSchema = z.object({
  subjectId: z.string().uuid("Invalid subject ID format"),
  chapterCode: z
    .string({ required_error: "Chapter code is required" })
    .max(50, "Chapter code must be at most 50 characters")
    .regex(
      /^[A-Z0-9_-]+$/,
      "Chapter code must contain only uppercase letters, numbers, underscores, and hyphens"
    ),
  chapterName: z
    .string({ required_error: "Chapter name is required" })
    .max(500, "Chapter name must be at most 500 characters"),
  classId: z.string().uuid("Invalid class ID format").optional(),
});

export const bulkCreateChapterSchema = z.object({
  subjectId: z.string().uuid("Invalid subject ID format"),
  chapters: z.array(
    z.object({
      chapterCode: z
        .string({ required_error: "Chapter code is required" })
        .max(50, "Chapter code must be at most 50 characters")
        .regex(
          /^[A-Z0-9_-]+$/,
          "Chapter code must contain only uppercase letters, numbers, underscores, and hyphens"
        ),
      chapterName: z
        .string({ required_error: "Chapter name is required" })
        .max(500, "Chapter name must be at most 500 characters"),
      classId: z.string().uuid("Invalid class ID format").optional(),
    })
  ).min(1, "At least one chapter is required"),
});

export const updateChapterSchema = z.object({
  chapterName: z.string().max(500, "Chapter name must be at most 500 characters").optional(),
  classId: z.string().uuid("Invalid class ID format").optional(),
  isActive: z.boolean().optional(),
});

export const chapterIdParamSchema = z.object({
  id: z.string().uuid("Invalid chapter ID format"),
});

export const subjectIdQuerySchema = z.object({
  subjectId: z.string().uuid("Invalid subject ID format").optional(),
});

export type CreateChapterInput = z.infer<typeof createChapterSchema>;
export type UpdateChapterInput = z.infer<typeof updateChapterSchema>;
export type ChapterIdParam = z.infer<typeof chapterIdParamSchema>;
export type SubjectIdQuery = z.infer<typeof subjectIdQuerySchema>;
