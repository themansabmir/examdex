export interface CreateExamInputDTO {
  examCode: string;
  examName: string;
  examFullName?: string;
  examBoard?: string;
  isPopular?: boolean;
}

export interface UpdateExamInputDTO {
  examName?: string;
  examFullName?: string;
  examBoard?: string;
  isActive?: boolean;
  isPopular?: boolean;
}

export interface ExamOutputDTO {
  id: string;
  examCode: string;
  examName: string;
  examFullName: string | null;
  examBoard: string | null;
  isActive: boolean;
  isPopular: boolean;
  createdAt: Date;
  updatedAt: Date;
}
