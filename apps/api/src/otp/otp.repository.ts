export type OtpType = "login" | "signup" | "forgot_password" | "number_change";

export interface Otp {
  id?: string;
  mobileNumber: string;
  code: string;
  expiresAt: Date;
  createdAt?: Date;
}

export interface IOtpRepository {
  save(otp: Omit<Otp, "id" | "createdAt">): Promise<Otp>;
  findLatest(mobileNumber: string, code: string): Promise<Otp | null>;
  deleteByMobileNumber(mobileNumber: string): Promise<void>;
}
