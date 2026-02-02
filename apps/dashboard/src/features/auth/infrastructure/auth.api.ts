import { httpClient } from "../../../infrastructure/http/client";
import type { AuthResponse, LoginInput } from "../domain/Login";

export const authApi = {
  login: async (credentials: LoginInput): Promise<AuthResponse> => {
    const response = await httpClient.post<AuthResponse>("/auth/admin/login", credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    // Assuming backend handles token invalidation or just clearing locally
    await httpClient.post("/auth/logout");
  },
};
