import { z } from "zod";

const idSchema = z.string({ required_error: "ID is required" }).min(1, "ID cannot be empty");

export const generateForExamSchema = z.object({
  examId: idSchema,
});

export const generateCustomPaperSchema = z.object({
  examId: idSchema,
  subjectIds: z.array(idSchema).min(1, "subjectIds must be a non-empty array"),
  topicIds: z.array(idSchema).min(1, "topicIds must be a non-empty array"),
});

export type GenerateForExamInput = z.infer<typeof generateForExamSchema>;
export type GenerateCustomPaperInput = z.infer<typeof generateCustomPaperSchema>;
