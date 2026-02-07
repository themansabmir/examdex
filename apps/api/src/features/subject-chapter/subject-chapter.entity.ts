export interface SubjectChapterProps {
  id: string;
  examSubjectId: string;
  chapterId: string;
  chapterNumber?: number | null;
  weightagePercentage: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class SubjectChapter {
  readonly id: string;
  readonly examSubjectId: string;
  readonly chapterId: string;
  readonly chapterNumber: number | null;
  readonly weightagePercentage: number;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: SubjectChapterProps) {
    this.id = props.id;
    this.examSubjectId = props.examSubjectId;
    this.chapterId = props.chapterId;
    this.chapterNumber = props.chapterNumber ?? null;
    this.weightagePercentage = props.weightagePercentage;
    this.isActive = props.isActive;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  // Validation: weightage must be between 0 and 100
  isValidWeightage(): boolean {
    return this.weightagePercentage >= 0 && this.weightagePercentage <= 100;
  }
}
