import { PrismaClient } from "@prisma/client";
import { GeneratedPaper } from "./generatedPaper.entity";

export interface IGeneratePaperRepositary {
  save(generatedPaper: GeneratedPaper): Promise<GeneratedPaper>;
}

export class PrismaGeneratedPaperRepository implements IGeneratePaperRepositary {
  constructor(private readonly prisma: PrismaClient) {}

  async save(generatedPaper: GeneratedPaper): Promise<GeneratedPaper> {
    const savedPaper = await this.prisma.generatedPaper.create({
      data: {
        id: generatedPaper.id,

        userId: generatedPaper.userId,
        examId: generatedPaper.examId,
        examSubjectId: generatedPaper.examSubjectId,

        paperTitle: generatedPaper.paperTitle,

        questionsData: generatedPaper.questionsData,

        selectedTopics: generatedPaper.selectedTopics,
        difficultyDistribution: generatedPaper.difficultyDistribution,

        totalQuestions: generatedPaper.totalQuestions,
        maxMarks: generatedPaper.maxMarks,
        timeLimitMinutes: generatedPaper.timeLimitMinutes,

        aiPromptTemplateId: generatedPaper.aiPromptTemplateId,
        aiPromptVersion: generatedPaper.aiPromptVersion,
        generationLatencyMs: generatedPaper.generationLatencyMs,

        generationStatus: generatedPaper.generationStatus,

        studentRating: generatedPaper.studentRating,
        isBookmarked: generatedPaper.isBookmarked,
        attemptCount: generatedPaper.attemptCount,

        createdAt: generatedPaper.createdAt,
      },
    });

    return new GeneratedPaper({
      id: savedPaper.id,

      userId: savedPaper.userId,
      examId: savedPaper.examId,
      examSubjectId: savedPaper.examSubjectId,

      paperTitle: savedPaper.paperTitle,

      questionsData: savedPaper.questionsData,

      selectedTopics: savedPaper.selectedTopics,
      difficultyDistribution: savedPaper.difficultyDistribution,

      totalQuestions: savedPaper.totalQuestions,
      maxMarks: savedPaper.maxMarks,
      timeLimitMinutes: savedPaper.timeLimitMinutes,

      aiPromptTemplateId: savedPaper.aiPromptTemplateId,
      aiPromptVersion: savedPaper.aiPromptVersion,
      generationLatencyMs: savedPaper.generationLatencyMs,

      generationStatus: savedPaper.generationStatus,

      studentRating: savedPaper.studentRating,
      isBookmarked: savedPaper.isBookmarked,
      attemptCount: savedPaper.attemptCount,

      createdAt: savedPaper.createdAt,
    });
  }
}
