import { z } from "zod";
import { type ExamSubject } from "../../exam-subject/domain/ExamSubject";
import { type Chapter } from "../../chapter/domain/Chapter";

export const CreateSubjectChapterSchema = z.object({
  examSubjectId: z
    .string({ required_error: "Exam-Subject mapping is required" })
    .uuid("Invalid exam-subject ID format"),
  chapterId: z
    .string({ required_error: "Chapter is required" })
    .uuid("Invalid chapter ID format"),
  chapterNumber: z.number().int().positive("Chapter number must be positive").optional(),
  weightagePercentage: z
    .number({ required_error: "Weightage percentage is required" })
    .min(0, "Weightage must be between 0 and 100")
    .max(100, "Weightage must be between 0 and 100"),
});

export const UpdateSubjectChapterSchema = z.object({
  chapterNumber: z.number().int().positive("Chapter number must be positive").optional(),
  weightagePercentage: z
    .number()
    .min(0, "Weightage must be between 0 and 100")
    .max(100, "Weightage must be between 0 and 100")
    .optional(),
  isActive: z.boolean().optional(),
});

export type CreateSubjectChapterInput = z.infer<typeof CreateSubjectChapterSchema>;
export type UpdateSubjectChapterInput = z.infer<typeof UpdateSubjectChapterSchema>;

export interface SubjectChapter {
  id: string;
  examSubjectId: string;
  chapterId: string;
  chapterNumber: number | null;
  weightagePercentage: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Relations
  examSubject?: ExamSubject;
  chapter?: Chapter;
}

export type SubjectChapterFormInput = CreateSubjectChapterInput & { isActive?: boolean };
