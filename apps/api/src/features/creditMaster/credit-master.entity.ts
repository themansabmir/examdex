export interface CreditMasterProps {
  id: string;
  creditsPerNewStudent: number;
  description: string | null;
  isActive: boolean;
  updatedById: string | null;
  updatedAt: Date;
  createdAt: Date;
}

export class CreditMaster {
  public readonly id: string;
  public creditsPerNewStudent: number;
  public description: string | null;
  public isActive: boolean;
  public updatedById: string | null;
  public readonly updatedAt: Date;
  public readonly createdAt: Date;

  constructor(props: CreditMasterProps) {
    this.id = props.id;
    this.creditsPerNewStudent = props.creditsPerNewStudent;
    this.description = props.description;
    this.isActive = props.isActive;
    this.updatedById = props.updatedById;
    this.updatedAt = props.updatedAt;
    this.createdAt = props.createdAt;
  }
}
