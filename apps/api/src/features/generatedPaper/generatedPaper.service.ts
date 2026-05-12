import { randomUUID } from "crypto";
import { GeneratedPaper } from "./generatedPaper.entity";
import { CreateGeneratedPaperInputDTO, GeneratedPaperOutputDTO } from "./generatedPaper.dto";
import { IGeneratePaperRepositary } from "./generatedPaper.repositary";
import { IUserExamRepositary } from "../userExamPrefrence/userExamPrefrence.repositary";
import { QuestionService } from "../questionData/questionData.service";
import { IExamConfigRepository } from "../examConfig/examConfig.repositary";
import { IExamSubjectRepository } from "../exam-subject";
import { NotFoundError } from "../../utils/app-error";

export class GeneratedPaperService {
  constructor(
    private readonly generatedPaper: IGeneratePaperRepositary,
    private readonly userExamPrefrence: IUserExamRepositary,
    private readonly questionService: QuestionService,
    private readonly examConfig: IExamConfigRepository,
    private readonly examSubject: IExamSubjectRepository
  ) {}

  async createGeneratedPaper(
    input: CreateGeneratedPaperInputDTO,
    userId: string
  ): Promise<GeneratedPaperOutputDTO> {
    let questions: any[] = [];

    if (input.type === "mock") {
      questions = await this.questionService.getQuestions();
    }

    const prefrence = await this.userExamPrefrence.findPrimaryById(userId);
    if (!prefrence) {
      throw new NotFoundError(
        "No primary exam preference found for the user. Please set your exam preferences first."
      );
    }

    const examSubject = await this.examSubject.findByExamAndSubject(
      prefrence.examId,
      prefrence.subjectId
    );
    if (!examSubject) {
      throw new NotFoundError("Exam subject not found for the user's preference.");
    }

    const config = await this.examConfig.findByExamSubjectId(examSubject.id);
    if (!config) {
      throw new NotFoundError("Exam configuration not found for the selected subject.");
    }

    const maxMarks = config.marksPerQuestion * questions.length;
    const totalTimeSeconds = questions.reduce(
      (sum, question: any) => sum + question.estimatedTimeSeconds,
      0
    );

    const timeLimitMinutes = totalTimeSeconds / 60;

    const generatedPaper = new GeneratedPaper({
      id: randomUUID(),

      userId,
      examId: prefrence.examId,
      examSubjectId: examSubject.id,

      paperTitle: input.paperTitle ?? "JEE",

      questionsData: questions,

      selectedTopics: input.selectedTopics,

      difficultyDistribution: input.difficultyDistribution,

      totalQuestions: questions.length,
      maxMarks: maxMarks,
      timeLimitMinutes: timeLimitMinutes,

      aiPromptTemplateId: null,

      aiPromptVersion: "v1",

      generationLatencyMs: 500,

      generationStatus: "completed",

      studentRating: null,

      isBookmarked: false,
      attemptCount: 0,

      createdAt: new Date(),
    });

    const savedPaper = await this.generatedPaper.save(generatedPaper);

    return {
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

      studentRating: null,

      isBookmarked: savedPaper.isBookmarked,
      attemptCount: savedPaper.attemptCount,

      createdAt: savedPaper.createdAt,
    };
  }
}
