import { Request, Response, NextFunction } from "express";
import { jwtService } from "../container";
import { UnauthorizedError } from "../utils";

export function protect(req: Request, _res: Response, next: NextFunction) {
  try {
    let token: string | undefined;

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      throw new UnauthorizedError("You are not logged in. Please log in to get access.");
    }

    // Verify token
    try {
      const decoded = jwtService.verifyAccessToken(token);

      // Grant access to protected route
      req.user = {
        id: decoded.userId,
        email: decoded.email,
        userType: decoded.userType,
      };

      next();
    } catch (error: any) {
      throw new UnauthorizedError(error.message || "Invalid token");
    }
  } catch (error) {
    next(error);
  }
}

// Extend Request type to include user
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string | null;
        userType: string;
      };
    }
  }
}
