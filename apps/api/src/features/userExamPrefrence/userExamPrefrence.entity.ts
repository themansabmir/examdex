export interface UserExamPreferenceProps {
  id: string;

  userId: string;
  examId: string;
  subjectId: string;

  isPrimary: boolean;

  targetExamDate?: Date | null;

  createdAt: Date;
}

export class UserExamPreference {
  readonly id: string;

  readonly userId: string;
  readonly examId: string;
  readonly subjectId: string;

  readonly isPrimary: boolean;

  readonly targetExamDate: Date | null;

  readonly createdAt: Date;

  constructor(props: UserExamPreferenceProps) {
    this.id = props.id;

    this.userId = props.userId;
    this.examId = props.examId;
    this.subjectId = props.subjectId;

    this.isPrimary = props.isPrimary;

    this.targetExamDate = props.targetExamDate ?? null;

    this.createdAt = props.createdAt;
  }
}
