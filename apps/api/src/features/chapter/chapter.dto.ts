export interface CreateChapterInputDTO {
  subjectId: string;
  chapterCode: string;
  chapterName: string;
  classId?: string;
}

export interface UpdateChapterInputDTO {
  chapterName?: string;
  classId?: string;
  isActive?: boolean;
}

export interface ChapterOutputDTO {
  id: string;
  subjectId: string;
  chapterCode: string;
  chapterName: string;
  classId: string | null;
  isActive: boolean;
}
