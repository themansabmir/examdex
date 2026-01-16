import { useQuery } from "@tanstack/react-query";
import { usersApi } from "../infrastructure/users.api";
import type { User } from "../domain/User";

export function useUsers() {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => usersApi.getAll(),
  });
}
