export interface CreateExamInputDTO {
  code: string;
  name: string;
  category: string;
}

export interface UpdateExamInputDTO {
  name?: string;
  category?: string;
  isActive?: boolean;
}

export interface ExamOutputDTO {
  id: string;
  code: string;
  name: string;
  category: string;
  isActive: boolean;
}
