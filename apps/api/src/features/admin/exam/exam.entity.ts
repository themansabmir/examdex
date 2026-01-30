export interface ExamProps {
  id?: string;
  code: string;
  name: string;
  category: string;
  isActive?: boolean;
}

export class Exam {
  public readonly id: string;
  public readonly code: string;
  public readonly name: string;
  public readonly category: string;
  public readonly isActive: boolean;

  constructor(props: ExamProps) {
    if (!props.code || !props.name) {
      throw new Error("Invalid exam data");
    }

    this.id = props.id ?? crypto.randomUUID();
    this.code = props.code;
    this.name = props.name;
    this.category = props.category;
    this.isActive = props.isActive ?? true;
  }

  deactivate(): Exam {
    return new Exam({ ...this, isActive: false });
  }
}
