import { Secret } from "jsonwebtoken";

export interface JwtPayload {
  userId: string;
  email: string;
  userType: string;
  roles?: string[];
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface JwtConfig {
  accessTokenSecret: Secret;
  refreshTokenSecret: Secret;
  accessTokenExpiresIn: string;
  refreshTokenExpiresIn: string;
}

export interface DecodedToken extends JwtPayload {
  iat: number;
  exp: number;
}
