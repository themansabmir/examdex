export interface CreateSubjectInputDTO {
  code: string;
  name: string;
}

export interface UpdateSubjectInputDTO {
  name?: string;
  isActive?: boolean;
}

export interface SubjectOutputDTO {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
}
