import { z } from "zod";

export const createExamConfigSchema = z.object({
  examSubjectId: z
    .string({ required_error: "Exam Subject ID is required" })
    .uuid("Invalid Exam Subject ID"),

  questionTypeId: z
    .string({ required_error: "Question Type ID is required" })
    .uuid("Invalid Question Type ID"),

  questionCount: z.coerce
    .number({ required_error: "Question count is required" })
    .int("Question count must be an integer"),

  marksPerQuestion: z.coerce.number({ required_error: "Marks per question is required" }),

  negativeMarks: z.coerce.number().optional(),

  displayOrder: z.coerce
    .number({ required_error: "Display order is required" })
    .int("Display order must be an integer"),

  difficultyMixJson: z.record(z.any()).optional(),
});

export const updateExamConfigSchema = z.object({
  questionCount: z.coerce.number().int("Question count must be an integer").optional(),

  marksPerQuestion: z.coerce.number().optional(),

  negativeMarks: z.coerce.number().optional(),

  displayOrder: z.coerce.number().int("Display order must be an integer").optional(),

  difficultyMixJson: z.record(z.any()).optional(),
});

export const examConfigIdParamSchema = z.object({
  id: z.string().uuid("Invalid ExamConfig ID"),
});

export type CreateExamConfigInput = z.infer<typeof createExamConfigSchema>;
export type UpdateExamConfigInput = z.infer<typeof updateExamConfigSchema>;
export type ExamConfigIdParamInput = z.infer<typeof examConfigIdParamSchema>;
