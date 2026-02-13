export interface CreateExamSubjectInputDTO {
  examId: string;
  subjectId: string;
  displayOrder?: number;
}

export interface UpdateExamSubjectInputDTO {
  displayOrder?: number;
  isActive?: boolean;
}

export interface ExamSubjectOutputDTO {
  id: string;
  examId: string;
  subjectId: string;
  displayOrder: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExamSubjectWithDetailsOutputDTO extends ExamSubjectOutputDTO {
  exam?: {
    id: string;
    examCode: string;
    examName: string;
  };
  subject?: {
    id: string;
    subjectCode: string;
    subjectName: string;
  };
}
