import { useMutation } from "@tanstack/react-query";
import { authApi } from "../infrastructure/auth.api";
import type { ResetPasswordRequestInput, ResetPasswordInput } from "../domain/Login";
import { toast } from "sonner";

export function useResetPassword() {
  const requestReset = useMutation({
    mutationFn: (input: ResetPasswordRequestInput) => authApi.requestPasswordReset(input),
    onSuccess: () => {
      toast.success("Reset link sent to your email");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to send reset link");
    },
  });

  const resetPassword = useMutation({
    mutationFn: (input: ResetPasswordInput) => authApi.resetPassword(input),
    onSuccess: () => {
      toast.success("Password reset successfully");
    },
    onError: (error: any) => {
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
