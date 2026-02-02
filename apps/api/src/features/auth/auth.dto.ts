export interface AdminLoginInputDTO {
  email: string;
  password: string;
}

export interface StudentAuthInputDTO {
  phoneOrEmail: string;
  countryCode?: string;
}

export interface VerifyOtpInputDTO {
  phoneOrEmail: string;
  otp: string;
  countryCode?: string;
}

export interface AuthTokensOutputDTO {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string | null;
    phone: string | null;
    fullName: string;
    userType: string;
    roles: string[];
  };
}

export interface RefreshTokenInputDTO {
  refreshToken: string;
}

export interface OtpSentOutputDTO {
  message: string;
  expiresAt: Date;
  isNewUser: boolean;
}
