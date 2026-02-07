export interface ClassProps {
  id: string;
  classCode: string;
  className: string;
  displayOrder: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Class {
  readonly id: string;
  readonly classCode: string;
  readonly className: string;
  readonly displayOrder: number | null;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: ClassProps) {
    this.id = props.id;
    this.classCode = props.classCode;
    this.className = props.className;
    this.displayOrder = props.displayOrder ?? null;
    this.isActive = props.isActive;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
