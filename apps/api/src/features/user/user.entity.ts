export interface UserProps {
  id: string;
  email: string | null;
  phoneNumber: string | null;
  fullName: string;
  passwordHash: string | null;
  userType: string;
  creditBalance: number;
  totalCreditsPurchased: number;
  isActive: boolean;
  isOnboarded: boolean;
  deviceFingerprint: string | null;
  lastLoginAt: Date | null;
  createdAt: Date;
  currentExam?: { id: string; name: string };
}

export class User {
  constructor(private readonly props: UserProps) { }

  get id(): string {
    return this.props.id;
  }

  get email(): string | null {
    return this.props.email;
  }

  get phoneNumber(): string | null {
    return this.props.phoneNumber;
  }

  get fullName(): string {
    return this.props.fullName;
  }

  get passwordHash(): string | null {
    return this.props.passwordHash;
  }

  get userType(): string {
    return this.props.userType;
  }

  get creditBalance(): number {
    return this.props.creditBalance;
  }

  get totalCreditsPurchased(): number {
    return this.props.totalCreditsPurchased;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get isOnboarded(): boolean {
    return this.props.isOnboarded;
  }

  get deviceFingerprint(): string | null {
    return this.props.deviceFingerprint;
  }

  get lastLoginAt(): Date | null {
    return this.props.lastLoginAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get currentExam(): { id: string; name: string } | undefined {
    return this.props.currentExam;
  }
}
