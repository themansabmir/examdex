import { z } from "zod";
import { type Exam } from "../../exam/domain/Exam";
import { type Subject } from "../../subject/domain/Subject";

export const CreateExamSubjectSchema = z.object({
  examId: z.string({ required_error: "Exam is required" }).uuid("Invalid exam ID format"),
  subjectId: z.string({ required_error: "Subject is required" }).uuid("Invalid subject ID format"),
  displayOrder: z.number().int().positive("Display order must be positive").optional(),
});

export const UpdateExamSubjectSchema = z.object({
  displayOrder: z.number().int().positive("Display order must be positive").optional(),
  isActive: z.boolean().optional(),
});

export type CreateExamSubjectInput = z.infer<typeof CreateExamSubjectSchema>;
export type UpdateExamSubjectInput = z.infer<typeof UpdateExamSubjectSchema>;

export interface ExamSubject {
  id: string;
  examId: string;
  subjectId: string;
  displayOrder: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Optional relations if included by API
  exam?: Exam;
  subject?: Subject;
}

export type ExamSubjectFormInput = CreateExamSubjectInput & { isActive?: boolean };
