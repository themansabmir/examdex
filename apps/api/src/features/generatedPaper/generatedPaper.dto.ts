export interface CreateGeneratedPaperInputDTO {
  userId?: string;
  examId?: string;
  examSubjectId?: string;
  type?: string;

  paperTitle?: string;

  // AI Generated Questions
  questionsData?: GeneratedQuestionDTO[];

  // Metadata
  selectedTopics: string[];
  difficultyDistribution: Record<string, any>;

  totalQuestions?: number;
  maxMarks?: number;
  timeLimitMinutes?: number;

  // AI Tracking
  aiPromptTemplateId?: string;
  aiPromptVersion?: string;
  generationLatencyMs?: number;
  generationStatus?: string;
}

export interface UpdateGeneratedPaperInputDTO {
  paperTitle?: string;

  questionsData?: GeneratedQuestionDTO[];

  selectedTopics?: string[];
  difficultyDistribution?: Record<string, any>;

  totalQuestions?: number;
  maxMarks?: number;
  timeLimitMinutes?: number;

  aiPromptTemplateId?: string;
  aiPromptVersion?: string;
  generationLatencyMs?: number;
  generationStatus?: string;

  // Quality Metrics
  studentRating?: number;
  isBookmarked?: boolean;
  attemptCount?: number;
}

export interface GeneratedPaperOutputDTO {
  id: string;

  userId: string;
  examId: string;
  examSubjectId: string;

  paperTitle: string | null;

  questionsData: GeneratedQuestionDTO[];

  selectedTopics: string[];

  difficultyDistribution: Record<string, any>;

  totalQuestions: number;
  maxMarks: number;
  timeLimitMinutes: number;

  aiPromptTemplateId: string | null;
  aiPromptVersion: string | null;
  generationLatencyMs: number | null;

  generationStatus: string;

  studentRating: number | null;
  isBookmarked: boolean;
  attemptCount: number;

  createdAt: Date;
}

export interface GeneratedQuestionDTO {
  questionNumber: number;

  topicId: string;
  topicName: string;

  difficulty: string;
  questionType: string;

  questionText: string;

  options?: string[];

  correctAnswer: string;

  solution?: string;

  marks: number;

  negativeMarks?: number;

  estimatedTimeSeconds?: number;
}
