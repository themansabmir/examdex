export interface ExamProps {
  id: string;
  examCode: string;
  examName: string;
  examFullName?: string | null;
  examBoard?: string | null;
  isActive: boolean;
  isPopular: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Exam {
  readonly id: string;
  readonly examCode: string;
  readonly examName: string;
  readonly examFullName: string | null;
  readonly examBoard: string | null;
  readonly isActive: boolean;
  readonly isPopular: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: ExamProps) {
    this.id = props.id;
    this.examCode = props.examCode;
    this.examName = props.examName;
    this.examFullName = props.examFullName ?? null;
    this.examBoard = props.examBoard ?? null;
    this.isActive = props.isActive;
    this.isPopular = props.isPopular;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
