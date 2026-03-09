// src/features/question-paper/questionPaper.service.ts
// Mock service for question paper generation (to be replaced by AI integration)

import { randomUUID } from "crypto";
import type { IUserRepository } from "../user/user.repository";
import type { IExamRepository } from "../exam/exam.repository";
import type { ICreditService } from "../credit";
import { ForbiddenError, NotFoundError } from "../../utils";

export interface GeneratePaperOptions {
  examId: string;
  userId: string;
  type: "full-exam" | "custom";
  subjectIds?: string[];
  topicIds?: string[];
}

export interface Question {
  id: string | number;
  text: string;
  // Add more fields as needed for your question model
}

export interface GeneratedPaper {
  id: string;
  examId: string;
  userId: string;
  questions: Question[];
  createdAt: Date;
}

export interface GenerateForExamUseCaseInput {
  examId: string;
  userId: string;
}

export interface GenerateCustomUseCaseInput {
  examId: string;
  userId: string;
  subjectIds: string[];
  topicIds: string[];
}

export interface GeneratePaperUseCaseOutput {
  paper: GeneratedPaper;
  newBalance: number;
  shouldNotify: boolean;
}

export class QuestionPaperService {
  async generatePaper(options: GeneratePaperOptions): Promise<GeneratedPaper> {
    // Mocked: Replace with AI logic
    return {
      id: randomUUID(),
      examId: options.examId,
      userId: options.userId,
      questions: [{ id: 1, text: "Sample Question" }],
      createdAt: new Date(),
    };
  }
}

export class QuestionPaperGenerationService {
  constructor(
    private readonly questionPaperService: QuestionPaperService,
    private readonly userRepository: IUserRepository,
    private readonly examRepository: IExamRepository,
    private readonly creditService: ICreditService
  ) {}

  async generateForExam(input: GenerateForExamUseCaseInput): Promise<GeneratePaperUseCaseOutput> {
    await this.assertActiveUser(input.userId);
    await this.assertActiveExam(input.examId);

    const paper = await this.questionPaperService.generatePaper({
      examId: input.examId,
      userId: input.userId,
      type: "full-exam",
    });

    const deductionResult = await this.creditService.deductCredit(
      input.userId,
      paper.id,
      "Paper generation for full exam"
    );

    return {
      paper,
      newBalance: deductionResult.newBalance,
      shouldNotify: deductionResult.shouldNotify,
    };
  }

  async generateCustom(input: GenerateCustomUseCaseInput): Promise<GeneratePaperUseCaseOutput> {
    await this.assertActiveUser(input.userId);
    await this.assertActiveExam(input.examId);

    const paper = await this.questionPaperService.generatePaper({
      examId: input.examId,
      userId: input.userId,
      type: "custom",
      subjectIds: input.subjectIds,
      topicIds: input.topicIds,
    });

    const deductionResult = await this.creditService.deductCredit(
      input.userId,
      paper.id,
      `Custom paper generation: ${input.subjectIds.length} subjects, ${input.topicIds.length} topics`
    );

    return {
      paper,
      newBalance: deductionResult.newBalance,
      shouldNotify: deductionResult.shouldNotify,
    };
  }

  private async assertActiveUser(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user || !user.isActive) {
      throw new ForbiddenError("Inactive or missing user", "USER_INACTIVE_OR_MISSING");
    }
  }

  private async assertActiveExam(examId: string): Promise<void> {
    const exam = await this.examRepository.findById(examId);

    if (!exam || !exam.isActive) {
      throw new NotFoundError("Exam not found or inactive", "EXAM_NOT_FOUND_OR_INACTIVE");
    }
  }
}
