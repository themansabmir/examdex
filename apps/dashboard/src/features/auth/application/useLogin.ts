import { useMutation } from "@tanstack/react-query";
import { authApi } from "../infrastructure/auth.api";
import type { LoginInput } from "../domain/Login";
import { toast } from "sonner";

export function useLogin() {
  return useMutation({
    mutationFn: (credentials: LoginInput) => authApi.login(credentials),
    onSuccess: (response) => {
      // Backend returns { success: true, data: { accessToken, user } }
      const { accessToken, user } = response.data;

      // Store token and user info
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success(`Welcome back, ${user.fullName}!`);

      // Reload to trigger App re-render with new auth state
      window.location.reload();
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";
      toast.error(message);
    },
  });
}
