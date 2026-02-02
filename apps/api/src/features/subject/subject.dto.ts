export interface CreateSubjectInputDTO {
  subjectCode: string;
  subjectName: string;
}

export interface UpdateSubjectInputDTO {
  subjectName?: string;
  isActive?: boolean;
}

export interface SubjectOutputDTO {
  id: string;
  subjectCode: string;
  subjectName: string;
  isActive: boolean;
}
