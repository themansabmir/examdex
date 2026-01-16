export interface UserProps {
  id?: string;
  email: string;
  name?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  public readonly id: string;
  public readonly email: string;
  public readonly name: string | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: UserProps) {
    this.id = props.id ?? crypto.randomUUID();
    this.email = props.email;
    this.name = props.name ?? null;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }
}
