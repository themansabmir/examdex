import { httpClient } from "../../../infrastructure/http/client";
import type { User, UpdateProfileInput } from "../domain/User";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const usersApi = {
  getAll: async (options?: { userType?: string; excludeStudent?: boolean }): Promise<User[]> => {
    const response = await httpClient.get<ApiResponse<User[]>>("/users", {
      params: options,
    });
    return response.data.data;
  },

  getMe: async (): Promise<User> => {
    const response = await httpClient.get<ApiResponse<User>>("/users/me");
    return response.data.data;
  },

  updateMe: async (input: UpdateProfileInput): Promise<User> => {
    const response = await httpClient.patch<ApiResponse<User>>("/users/me", input);
    return response.data.data;
  },
};
