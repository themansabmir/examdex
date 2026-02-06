import { httpClient } from "../../../infrastructure/http/client";
import type { Exam, CreateExamInput, UpdateExamInput } from "../domain/Exam";

export const examApi = {
  getAll: async (params?: { active?: boolean; popular?: boolean }): Promise<Exam[]> => {
    const response = await httpClient.get<{ success: boolean; data: Exam[] }>("/exams", { params });
    return response.data.data;
  },

  getById: async (id: string): Promise<Exam> => {
    const response = await httpClient.get<{ success: boolean; data: Exam }>(`/exams/${id}`);
    return response.data.data;
  },

  create: async (data: CreateExamInput): Promise<Exam> => {
    const response = await httpClient.post<{ success: boolean; data: Exam }>("/exams", data);
    return response.data.data;
  },

  update: async (id: string, data: UpdateExamInput): Promise<Exam> => {
    const response = await httpClient.put<{ success: boolean; data: Exam }>(`/exams/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.delete(`/exams/${id}`);
  },
};
