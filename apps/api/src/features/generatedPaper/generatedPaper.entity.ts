export interface GeneratedPaperProps {
  id: string;

  userId: string;
  examId: string;
  examSubjectId: string;

  paperTitle?: string | null;

  // AI Generated Questions JSON
  questionsData: any;

  // Metadata
  selectedTopics: string[];
  difficultyDistribution: any;
  totalQuestions: number;
  maxMarks: number;
  timeLimitMinutes: number;

  // AI Tracking
  aiPromptTemplateId?: string | null;
  aiPromptVersion?: string | null;
  generationLatencyMs?: number | null;
  generationStatus: string;

  // Quality Metrics
  studentRating?: number | null;
  isBookmarked: boolean;
  attemptCount: number;

  createdAt: Date;
}

export class GeneratedPaper {
  readonly id: string;

  readonly userId: string;
  readonly examId: string;
  readonly examSubjectId: string;

  readonly paperTitle: string | null;

  readonly questionsData: any;

  readonly selectedTopics: string[];
  readonly difficultyDistribution: any;
  readonly totalQuestions: number;
  readonly maxMarks: number;
  readonly timeLimitMinutes: number;

  readonly aiPromptTemplateId: string | null;
  readonly aiPromptVersion: string | null;
  readonly generationLatencyMs: number | null;
  readonly generationStatus: string;

  readonly studentRating: number | null;
  readonly isBookmarked: boolean;
  readonly attemptCount: number;

  readonly createdAt: Date;

  constructor(props: GeneratedPaperProps) {
    this.id = props.id;

    this.userId = props.userId;
    this.examId = props.examId;
    this.examSubjectId = props.examSubjectId;

    this.paperTitle = props.paperTitle ?? null;

    this.questionsData = props.questionsData;

    this.selectedTopics = props.selectedTopics;
    this.difficultyDistribution = props.difficultyDistribution;

    this.totalQuestions = props.totalQuestions;
    this.maxMarks = props.maxMarks;
    this.timeLimitMinutes = props.timeLimitMinutes;

    this.aiPromptTemplateId = props.aiPromptTemplateId ?? null;
    this.aiPromptVersion = props.aiPromptVersion ?? null;
    this.generationLatencyMs = props.generationLatencyMs ?? null;

    this.generationStatus = props.generationStatus;

    this.studentRating = props.studentRating ?? null;

    this.isBookmarked = props.isBookmarked;
    this.attemptCount = props.attemptCount;

    this.createdAt = props.createdAt;
  }
}
