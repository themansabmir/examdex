import { UserType } from "@prisma/client";

export interface CreateUserInputDTO {
  email?: string | null;
  phone?: string | null;
  fullName: string;
  password?: string;
  userType: UserType;
  roles?: string[];
  isActive?: boolean;
  examId?: string;
}

export interface UpdateUserInputDTO {
  fullName?: string;
  email?: string | null;
  phone?: string | null;
  isActive?: boolean;
  roles?: string[];
  examId?: string;
  isOnboarded?: boolean;
}

export interface UpdateProfileInputDTO {
  fullName?: string;
  email?: string;
  phone?: string;
}

export interface UserOutputDTO {
  id: string;
  email: string | null;
  phone: string | null;
  fullName: string;
  userType: UserType;
  roles: string[];
  isActive: boolean;
  isOnboarded: boolean;
  creditBalance: number;
  totalCreditsPurchased: number;
  deviceFingerprint: string | null;
  lastLoginAt: Date | null;
  createdAt: Date;
  currentExam?: {
    id: string;
    name: string;
  };
}
