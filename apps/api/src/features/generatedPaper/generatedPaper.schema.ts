import { z } from "zod";

export const generatedQuestionSchema = z.object({
  questionNumber: z.number(),
  topicId: z.string().uuid(),
  topicName: z.string(),
  difficulty: z.string(),
  questionType: z.string(),
  questionText: z.string(),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string(),
  solution: z.string().optional(),
  marks: z.number(),
  negativeMarks: z.number().optional(),
  estimatedTimeSeconds: z.number().optional(),
});

export const createGeneratedPaperSchema = z.object({
  userId: z.string().uuid().optional(),
  examId: z.string().uuid().optional(),
  examSubjectId: z.string().uuid().optional(),
  type: z.string().optional(),
  paperTitle: z.string().optional(),
  questionsData: z.array(generatedQuestionSchema).optional(),
  selectedTopics: z.array(z.string().uuid()),
  difficultyDistribution: z.record(z.any()),
  totalQuestions: z.number().optional(),
  maxMarks: z.number().optional(),
  timeLimitMinutes: z.number().optional(),
  aiPromptTemplateId: z.string().uuid().optional(),
  aiPromptVersion: z.string().optional(),
  generationLatencyMs: z.number().optional(),
  generationStatus: z.string().optional(),
});

export const updateGeneratedPaperSchema = z.object({
  paperTitle: z.string().optional(),
  questionsData: z.array(generatedQuestionSchema).optional(),
  selectedTopics: z.array(z.string()).optional(),
  difficultyDistribution: z.record(z.any()).optional(),
  totalQuestions: z.number().optional(),
  maxMarks: z.number().optional(),
  timeLimitMinutes: z.number().optional(),
  aiPromptTemplateId: z.string().uuid().optional(),
  aiPromptVersion: z.string().optional(),
  generationLatencyMs: z.number().optional(),
  generationStatus: z.string().optional(),
  studentRating: z.number().optional(),
  isBookmarked: z.boolean().optional(),
  attemptCount: z.number().optional(),
});

export const generatedPaperIdParamSchema = z.object({
  id: z.string().uuid("Invalid generated paper ID format"),
});

export type CreateGeneratedPaperInput = z.infer<typeof createGeneratedPaperSchema>;
export type UpdateGeneratedPaperInput = z.infer<typeof updateGeneratedPaperSchema>;
export type GeneratedPaperIdParam = z.infer<typeof generatedPaperIdParamSchema>;
