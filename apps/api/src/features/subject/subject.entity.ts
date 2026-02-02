export interface SubjectProps {
  id: string;
  subjectCode: string;
  subjectName: string;
  isActive: boolean;
}

export class Subject {
  readonly id: string;
  readonly subjectCode: string;
  readonly subjectName: string;
  readonly isActive: boolean;

  constructor(props: SubjectProps) {
    this.id = props.id;
    this.subjectCode = props.subjectCode;
    this.subjectName = props.subjectName;
    this.isActive = props.isActive;
  }
}
