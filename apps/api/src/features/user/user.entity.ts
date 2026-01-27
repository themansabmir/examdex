export interface UserProps {
  id?: string;
  email?: string | null;
  mobileNumber?: string | null;
  password?: string | null;
  name?: string | null;
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  public readonly id: string;
  public readonly email: string | null;
  public readonly mobileNumber: string | null;
  public readonly password: string | null;
  public readonly name: string | null;
  public readonly role: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: UserProps) {
    this.id = props.id ?? crypto.randomUUID();
    this.email = props.email ?? null;
    this.mobileNumber = props.mobileNumber ?? null;
    this.password = props.password ?? null;
    this.name = props.name ?? null;
    this.role = props.role ?? "student";
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }
}
