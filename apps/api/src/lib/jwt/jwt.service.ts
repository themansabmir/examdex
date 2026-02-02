import jwt, { TokenExpiredError, JsonWebTokenError, Secret, SignOptions } from "jsonwebtoken";
import { JwtPayload, TokenPair, JwtConfig, DecodedToken } from "./jwt.types";

export class JwtService {
  private readonly config: JwtConfig;

  constructor(config: JwtConfig) {
    this.config = config;
  }

  /**
   * Helper to safely retrieve secrets and ensure they aren't undefined
   */
  private getSecret(type: "access" | "refresh"): Secret {
    const secret =
      type === "access" ? this.config.accessTokenSecret : this.config.refreshTokenSecret;

    if (!secret) {
      throw new Error(`JWT ${type} secret is not defined in configuration.`);
    }
    return secret as Secret;
  }

  /**
   * Generate access and refresh token pair
   */
  generateTokenPair(payload: JwtPayload): TokenPair {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  /**
   * Generate access token (short-lived)
   */
  generateAccessToken(payload: JwtPayload): string {
    const options: SignOptions = {
      expiresIn: this.config.accessTokenExpiresIn as SignOptions["expiresIn"],
    };

    return jwt.sign(payload as object, this.getSecret("access"), options);
  }

  /**
   * Generate refresh token (long-lived)
   */
  generateRefreshToken(payload: JwtPayload): string {
    const options: SignOptions = {
      expiresIn: this.config.refreshTokenExpiresIn as SignOptions["expiresIn"],
    };

    // Extract minimal data for refresh token to keep it small
    const refreshPayload = {
      userId: payload.userId,
      email: payload.email,
    };

    return jwt.sign(refreshPayload as object, this.getSecret("refresh"), options);
  }

  /**
   * Verify access token
   */
  verifyAccessToken(token: string): DecodedToken {
    try {
      return jwt.verify(token, this.getSecret("access")) as DecodedToken;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new Error("Access token expired");
      }
      if (error instanceof JsonWebTokenError) {
        throw new Error("Invalid access token");
      }
      throw error;
    }
  }

  /**
   * Verify refresh token
   */
  verifyRefreshToken(token: string): DecodedToken {
    try {
      return jwt.verify(token, this.getSecret("refresh")) as DecodedToken;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new Error("Refresh token expired");
      }
      if (error instanceof JsonWebTokenError) {
        throw new Error("Invalid refresh token");
      }
      throw error;
    }
  }

  /**
   * Decode token without verification (useful for logging/debugging)
   */
  decode(token: string): DecodedToken | null {
    return jwt.decode(token) as DecodedToken | null;
  }

  /**
   * Check if token is expired manually
   */
  isTokenExpired(token: string): boolean {
    const decoded = this.decode(token);
    if (!decoded || !decoded.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  }
}
