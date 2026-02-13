import { useMutation } from "@tanstack/react-query";
import { authApi } from "../infrastructure/auth.api";
import type { AcceptInviteInput } from "../domain/Login";
import { toast } from "sonner";
import { useAuth } from "@/app/AuthContext";

export function useAcceptInvite() {
  const { login } = useAuth();

  return useMutation({
    mutationFn: (input: AcceptInviteInput) => authApi.acceptInvite(input),
    onSuccess: (response) => {
      const { accessToken, user } = response.data;
      login(accessToken, user);
      toast.success("Welcome to the team!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to accept invitation");
    },
  });
}
