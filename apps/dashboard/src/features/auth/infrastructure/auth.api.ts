import { httpClient } from "../../../infrastructure/http/client";
import type {
  AuthResponse,
  LoginInput,
  InviteAdminInput,
  AcceptInviteInput,
  ResetPasswordRequestInput,
  ResetPasswordInput,
} from "../domain/Login";

export const authApi = {
  login: async (credentials: LoginInput): Promise<AuthResponse> => {
    const response = await httpClient.post<AuthResponse>("/auth/admin/login", credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    // Assuming backend handles token invalidation or just clearing locally
    await httpClient.post("/auth/logout");
  },

  inviteAdmin: async (input: InviteAdminInput): Promise<void> => {
    await httpClient.post("/auth/invite", input);
  },

  acceptInvite: async (input: AcceptInviteInput): Promise<AuthResponse> => {
    const response = await httpClient.post<AuthResponse>("/auth/accept-invite", input);
    return response.data;
  },

  requestPasswordReset: async (input: ResetPasswordRequestInput): Promise<void> => {
    await httpClient.post("/auth/password-reset-request", input);
  },

  resetPassword: async (input: ResetPasswordInput): Promise<void> => {
    await httpClient.post("/auth/reset-password", input);
  },
};
