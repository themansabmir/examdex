export interface CreateExamConfigDto {
  examSubjectId: string;
  questionTypeId: string;
  questionCount: number;
  marksPerQuestion: number;
  negativeMarks?: number;
  displayOrder: number;
  difficultyMixJson?: any;
}

export interface UpdateExamConfigDto {
  questionCount?: number;
  marksPerQuestion?: number;
  negativeMarks?: number;
  displayOrder?: number;
  difficultyMixJson?: any;
}

export interface ExamConfigOutputDto {
  id: string;
  examSubjectId: string;
  questionTypeId: string;
  questionCount: number;
  marksPerQuestion: number;
  negativeMarks?: number;
  displayOrder: number;
  difficultyMixJson?: any;
  createdAt: Date;
  updatedAt: Date;
}
