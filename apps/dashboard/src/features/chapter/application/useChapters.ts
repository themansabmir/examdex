import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { chapterApi } from "../infrastructure/chapter.api";
import { toast } from "sonner";
import type { CreateChapterInput, UpdateChapterInput } from "../domain/Chapter";

export function useChapters(params?: { active?: boolean; subjectId?: string; classId?: string }) {
  return useQuery({
    queryKey: ["chapters", params],
    queryFn: () => chapterApi.getAll(params),
  });
}

export function useChapter(id: string | undefined) {
  return useQuery({
    queryKey: ["chapters", id],
    queryFn: () => chapterApi.getById(id!),
    enabled: !!id,
  });
}

export function useCreateChapter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateChapterInput) => chapterApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapters"] });
      toast.success("Chapter created successfully");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Failed to create chapter");
    },
  });
}

export function useUpdateChapter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateChapterInput }) =>
      chapterApi.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["chapters"] });
      queryClient.invalidateQueries({ queryKey: ["chapters", data.id] });
      toast.success("Chapter updated successfully");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Failed to update chapter");
    },
  });
}

export function useDeleteChapter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => chapterApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapters"] });
      toast.success("Chapter deleted successfully");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Failed to delete chapter");
    },
  });
}
