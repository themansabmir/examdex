import { z } from "zod";

export const CreateSubjectSchema = z.object({
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

export const UpdateSubjectSchema = CreateSubjectSchema.extend({
  subjectCode: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type CreateSubjectInput = z.infer<typeof CreateSubjectSchema>;
export type UpdateSubjectInput = z.infer<typeof UpdateSubjectSchema>;
export type SubjectFormInput = CreateSubjectInput & { isActive?: boolean };

export interface Subject {
  id: string;
  subjectCode: string;
  subjectName: string;
  isActive: boolean;
}
