import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { subjectChapterApi } from "../infrastructure/subject-chapter.api";
import type {
  CreateSubjectChapterInput,
  UpdateSubjectChapterInput,
} from "../domain/SubjectChapter";
import { toast } from "sonner";
import type { AxiosError } from "axios";

export const subjectChapterKeys = {
  all: ["subject-chapters"] as const,
  lists: () => [...subjectChapterKeys.all, "list"] as const,
  list: () => [...subjectChapterKeys.lists()] as const,
  details: () => [...subjectChapterKeys.all, "detail"] as const,
  detail: (id: string) => [...subjectChapterKeys.details(), id] as const,
  byExamSubject: (id: string) => [...subjectChapterKeys.all, "by-exam-subject", id] as const,
};

export function useSubjectChapters() {
  return useQuery({
    queryKey: subjectChapterKeys.list(),
    queryFn: () => subjectChapterApi.getAll(),
  });
}

export function useSubjectChapter(id?: string) {
  return useQuery({
    queryKey: subjectChapterKeys.detail(id!),
    queryFn: () => subjectChapterApi.getById(id!),
    enabled: !!id,
  });
}

export function useChaptersByExamSubject(examSubjectId?: string) {
  return useQuery({
    queryKey: subjectChapterKeys.byExamSubject(examSubjectId!),
    queryFn: () => subjectChapterApi.getChaptersByExamSubject(examSubjectId!),
    enabled: !!examSubjectId,
  });
}

export function useCreateSubjectChapter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSubjectChapterInput) => subjectChapterApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectChapterKeys.all });
      toast.success("Subject-Chapter mapping created successfully");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || "Failed to create mapping");
    },
  });
}

export function useUpdateSubjectChapter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSubjectChapterInput }) =>
      subjectChapterApi.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: subjectChapterKeys.all });
      queryClient.invalidateQueries({ queryKey: subjectChapterKeys.detail(data.id) });
      toast.success("Subject-Chapter mapping updated successfully");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || "Failed to update mapping");
    },
  });
}

export function useDeleteSubjectChapter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => subjectChapterApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectChapterKeys.all });
      toast.success("Subject-Chapter mapping deleted successfully");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || "Failed to delete mapping");
    },
  });
}
