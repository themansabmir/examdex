import { useMutation } from "@tanstack/react-query";
import { authApi } from "../infrastructure/auth.api";
import type { ResetPasswordRequestInput, ResetPasswordInput } from "../domain/Login";
import { toast } from "sonner";
import type { AxiosError } from "axios";

export function useResetPassword() {
  const requestReset = useMutation({
    mutationFn: (input: ResetPasswordRequestInput) => authApi.requestPasswordReset(input),
    onSuccess: () => {
      toast.success("Reset link sent to your email");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || "Failed to send reset link");
    },
  });

  const resetPassword = useMutation({
    mutationFn: (input: ResetPasswordInput) => authApi.resetPassword(input),
    onSuccess: () => {
      toast.success("Password reset successfully");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || "Failed to reset password");
    },
  });

  return {
    requestReset: requestReset.mutate,
    isRequesting: requestReset.isPending,
    resetPassword: resetPassword.mutate,
    isResetting: resetPassword.isPending,
  };
}
