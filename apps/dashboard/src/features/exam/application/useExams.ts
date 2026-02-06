import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { examApi } from "../infrastructure/exam.api";
import { toast } from "sonner";
import type { CreateExamInput, UpdateExamInput } from "../domain/Exam";

export function useExams(params?: { active?: boolean; popular?: boolean }) {
  return useQuery({
    queryKey: ["exams", params],
    queryFn: () => examApi.getAll(params),
  });
}

export function useExam(id: string | undefined) {
  return useQuery({
    queryKey: ["exams", id],
    queryFn: () => examApi.getById(id!),
    enabled: !!id,
  });
}

export function useCreateExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExamInput) => examApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      toast.success("Exam created successfully");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Failed to create exam");
    },
  });
}

export function useUpdateExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateExamInput }) =>
      examApi.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      queryClient.invalidateQueries({ queryKey: ["exams", data.id] });
      toast.success("Exam updated successfully");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Failed to update exam");
    },
  });
}

export function useDeleteExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => examApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      toast.success("Exam deleted successfully");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Failed to delete exam");
    },
  });
}
