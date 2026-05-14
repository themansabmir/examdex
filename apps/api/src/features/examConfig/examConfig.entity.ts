export interface ExamConfigProps {
  id: string;
  examSubjectId: string;
  questionTypeId: string;

  questionCount: number;

  marksPerQuestion: number;
  negativeMarks?: number | null;

  displayOrder: number;

  difficultyMixJson?: any;

  createdAt: Date;
  updatedAt: Date;
}

export class ExamConfig {
  readonly id: string;

  readonly examSubjectId: string;
  readonly questionTypeId: string;

  readonly questionCount: number;

  readonly marksPerQuestion: number;
  readonly negativeMarks: number | null;

  readonly displayOrder: number;

  readonly difficultyMixJson: any;

  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: ExamConfigProps) {
    this.id = props.id;

    this.examSubjectId = props.examSubjectId;
    this.questionTypeId = props.questionTypeId;

    this.questionCount = props.questionCount;

    this.marksPerQuestion = props.marksPerQuestion;

    this.negativeMarks = props.negativeMarks ?? null;

    this.displayOrder = props.displayOrder;

    this.difficultyMixJson = props.difficultyMixJson;

    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
