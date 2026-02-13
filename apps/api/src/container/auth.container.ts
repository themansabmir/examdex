import { AuthService, AuthController } from "../features";
import { userRepository } from "./user.container";
import { otpService, jwtService } from "./shared.container";

export const authService = new AuthService(userRepository, otpService, jwtService);
export const authController = new AuthController(authService);
