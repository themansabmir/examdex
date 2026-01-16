import type { ExamStatus } from "./exam.entity";

export interface CreateExamInputDTO {
  title: string;
  description?: string;
  userId: string;
  duration?: number;
  passingScore?: number;
}

export interface ExamOutputDTO {
  id: string;
  title: string;
  description: string | null;
  userId: string;
  status: ExamStatus;
  duration: number;
  passingScore: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublishExamInputDTO {
  examId: string;
  userId: string;
}
