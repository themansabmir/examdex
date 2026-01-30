export interface UserProps {
  id?: string;
  email: string;
  name?: string | null;
}

export class User {
  public readonly id: string;
  public readonly email: string;
  public readonly name: string | null;

  constructor(props: UserProps) {
    this.id = props.id ?? crypto.randomUUID();
    this.email = props.email;
    this.name = props.name ?? null;
  }
}
