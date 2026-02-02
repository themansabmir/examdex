import { useMutation } from "@tanstack/react-query";
import { authApi } from "../infrastructure/auth.api";
import type { LoginInput } from "../domain/Login";
import { toast } from "@repo/ui";

export function useLogin() {
  return useMutation({
    mutationFn: (credentials: LoginInput) => authApi.login(credentials),
    onSuccess: (data) => {
      // Store tokens
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success(`Welcome back, ${data.user.fullName}!`);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Login failed. Please check your credentials.";
      toast.error(message);
    },
  });
}
