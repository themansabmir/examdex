export interface User {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  userType: string;
  isActive: boolean;
  isOnboarded: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

export interface UpdateProfileInput {
  fullName?: string;
  email?: string;
  phone?: string;
}
