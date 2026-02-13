import { z } from "zod";

export const CreateChapterSchema = z.object({
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

export const UpdateChapterSchema = CreateChapterSchema.extend({
  subjectId: z.string().optional(),
  chapterCode: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type CreateChapterInput = z.infer<typeof CreateChapterSchema>;
export type UpdateChapterInput = z.infer<typeof UpdateChapterSchema>;
export type ChapterFormInput = CreateChapterInput & { isActive?: boolean };

export interface Chapter {
  id: string;
  subjectId: string;
  chapterCode: string;
  chapterName: string;
  classId: string | null;
  isActive: boolean;
  subject?: {
    subjectName: string;
    subjectCode: string;
  };
}
