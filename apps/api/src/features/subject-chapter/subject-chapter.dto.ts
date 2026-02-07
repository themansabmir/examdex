export interface CreateSubjectChapterInputDTO {
  examSubjectId: string;
  chapterId: string;
  chapterNumber?: number;
  weightagePercentage: number;
}

export interface UpdateSubjectChapterInputDTO {
  chapterNumber?: number;
  weightagePercentage?: number;
  isActive?: boolean;
}

export interface SubjectChapterOutputDTO {
  id: string;
  examSubjectId: string;
  chapterId: string;
  chapterNumber: number | null;
  weightagePercentage: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubjectChapterWithDetailsOutputDTO extends SubjectChapterOutputDTO {
  chapter?: {
    id: string;
    chapterCode: string;
    chapterName: string;
  };
  examSubject?: {
    id: string;
    examId: string;
    subjectId: string;
  };
}
