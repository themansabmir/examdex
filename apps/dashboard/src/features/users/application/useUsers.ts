import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "../infrastructure/users.api";
import type { User, UpdateProfileInput } from "../domain/User";
import { toast } from "sonner";
import type { AxiosError } from "axios";

export function useUsers(options?: { userType?: string; excludeStudent?: boolean }) {
  return useQuery<User[]>({
    queryKey: ["users", options],
    queryFn: () => usersApi.getAll(options),
  });
}

export function useProfile() {
  const queryClient = useQueryClient();

  const profileQuery = useQuery<User>({
    queryKey: ["profile", "me"],
    queryFn: () => usersApi.getMe(),
  });

  const updateProfileMutation = useMutation({
    mutationFn: (input: UpdateProfileInput) => usersApi.updateMe(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
      toast.success("Profile updated successfully");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
  };
}
