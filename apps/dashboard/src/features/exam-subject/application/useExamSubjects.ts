import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { examSubjectApi } from "../infrastructure/exam-subject.api";
import type { CreateExamSubjectInput, UpdateExamSubjectInput } from "../domain/ExamSubject";
import { toast } from "sonner";
import type { AxiosError } from "axios";

export const examSubjectKeys = {
  all: ["exam-subjects"] as const,
  lists: () => [...examSubjectKeys.all, "list"] as const,
  list: () => [...examSubjectKeys.lists()] as const,
  details: () => [...examSubjectKeys.all, "detail"] as const,
  detail: (id: string) => [...examSubjectKeys.details(), id] as const,
  byExam: (examId: string) => [...examSubjectKeys.all, "by-exam", examId] as const,
};

export function useExamSubjects() {
  return useQuery({
    queryKey: examSubjectKeys.list(),
    queryFn: () => examSubjectApi.getAll(),
  });
}

export function useExamSubject(id?: string) {
  return useQuery({
    queryKey: examSubjectKeys.detail(id!),
    queryFn: () => examSubjectApi.getById(id!),
    enabled: !!id,
  });
}

export function useSubjectsByExam(examId?: string) {
  return useQuery({
    queryKey: examSubjectKeys.byExam(examId!),
    queryFn: () => examSubjectApi.getSubjectsByExam(examId!),
    enabled: !!examId,
  });
}

export function useCreateExamSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExamSubjectInput) => examSubjectApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: examSubjectKeys.all });
      toast.success("Exam-Subject mapping created successfully");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || "Failed to create mapping");
    },
  });
}

export function useUpdateExamSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateExamSubjectInput }) =>
      examSubjectApi.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: examSubjectKeys.all });
      queryClient.invalidateQueries({ queryKey: examSubjectKeys.detail(data.id) });
      toast.success("Exam-Subject mapping updated successfully");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || "Failed to update mapping");
    },
  });
}

export function useDeleteExamSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => examSubjectApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: examSubjectKeys.all });
      toast.success("Exam-Subject mapping deleted successfully");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || "Failed to delete mapping");
    },
  });
}
