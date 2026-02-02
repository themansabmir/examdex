export interface CreateUserInputDTO {
  email?: string | null;
  phone?: string | null;
  fullName: string;
  password?: string;
  userType: string;
  roles?: string[];
  isActive?: boolean;
}

export interface UpdateUserInputDTO {
  fullName?: string;
  email?: string | null;
  phone?: string | null;
  isActive?: boolean;
  roles?: string[];
}

export interface UserOutputDTO {
  id: string;
  email: string | null;
  phone: string | null;
  fullName: string;
  userType: string;
  roles: string[];
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
}
