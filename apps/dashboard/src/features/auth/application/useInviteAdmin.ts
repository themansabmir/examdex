import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../infrastructure/auth.api";
import type { InviteAdminInput } from "../domain/Login";
import { toast } from "sonner";

export function useInviteAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: InviteAdminInput) => authApi.inviteAdmin(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Invitation sent successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to send invitation");
    },
  });
}
