import { useMutation } from "@tanstack/react-query";
import { authApi } from "../infrastructure/auth.api";
import type { LoginInput } from "../domain/Login";
import { toast } from "sonner";
import { useAuth } from "@/app/AuthContext";
import type { AxiosError } from "axios";

export function useLogin() {
  const { login } = useAuth();

  return useMutation({
    mutationFn: (credentials: LoginInput) => authApi.login(credentials),
    onSuccess: (response) => {
      const { accessToken, user } = response.data;
      login(accessToken, user);
      toast.success(`Welcome back, ${user.fullName}!`);
    },
    onError: (error: AxiosError<{ error?: { message: string }; message: string }>) => {
      const message =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";
      toast.error(message);
    },
  });
}
