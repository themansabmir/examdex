export interface SubjectProps {
  id?: string;
  code: string;
  name: string;
  isActive?: boolean;
}

export class Subject {
  public readonly id: string;
  public readonly code: string;
  public readonly name: string;
  public readonly isActive: boolean;

  constructor(props: SubjectProps) {
    if (!props.code || !props.name) {
      throw new Error("Invalid subject data");
    }

    this.id = props.id ?? crypto.randomUUID();
    this.code = props.code;
    this.name = props.name;
    this.isActive = props.isActive ?? true;
  }

  deactivate(): Subject {
    return new Subject({ ...this, isActive: false });
  }
}
