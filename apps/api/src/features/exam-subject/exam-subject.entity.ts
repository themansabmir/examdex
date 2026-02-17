export interface ExamSubjectProps {
  id: string;
  examId: string;
  subjectId: string;
  displayOrder?: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  subject?: {
    id: string;
    subjectCode: string;
    subjectName: string;
  };
  exam?: {
    id: string;
    examCode: string;
    examName: string;
  };
}

export class ExamSubject {
  readonly id: string;
  readonly examId: string;
  readonly subjectId: string;
  readonly displayOrder: number | null;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: ExamSubjectProps) {
    this.id = props.id;
    this.examId = props.examId;
    this.subjectId = props.subjectId;
    this.displayOrder = props.displayOrder ?? null;
    this.isActive = props.isActive;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.subject = props.subject;
    this.exam = props.exam;
  }

  readonly subject?: {
    id: string;
    subjectCode: string;
    subjectName: string;
  };

  readonly exam?: {
    id: string;
    examCode: string;
    examName: string;
  };
}
