import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { classApi } from "../infrastructure/class.api";
import type { CreateClassInput, UpdateClassInput } from "../domain/Class";
import { toast } from "sonner";

export const classKeys = {
  all: ["classes"] as const,
  lists: () => [...classKeys.all, "list"] as const,
  list: (filters: any) => [...classKeys.lists(), { filters }] as const,
  details: () => [...classKeys.all, "detail"] as const,
  detail: (id: string) => [...classKeys.details(), id] as const,
};

export function useClasses(params?: { active?: boolean }) {
  return useQuery({
    queryKey: classKeys.list(params),
    queryFn: () => classApi.getAll(params),
  });
}

export function useClass(id?: string) {
  return useQuery({
    queryKey: classKeys.detail(id!),
    queryFn: () => classApi.getById(id!),
    enabled: !!id,
  });
}

export function useCreateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClassInput) => classApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classKeys.all });
      toast.success("Class created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create class");
    },
  });
}

export function useUpdateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClassInput }) =>
      classApi.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: classKeys.all });
      queryClient.invalidateQueries({ queryKey: classKeys.detail(data.id) });
      toast.success("Class updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update class");
    },
  });
}

export function useDeleteClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => classApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classKeys.all });
      toast.success("Class deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete class");
    },
  });
}
