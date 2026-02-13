import { httpClient } from "../../../infrastructure/http/client";
import type { ExamSubject, CreateExamSubjectInput, UpdateExamSubjectInput } from "../domain/ExamSubject";

export const examSubjectApi = {
  getAll: async (): Promise<ExamSubject[]> => {
    const response = await httpClient.get<{ success: boolean; data: ExamSubject[] }>("/exam-subject");
    return response.data.data;
  },

  getById: async (id: string): Promise<ExamSubject> => {
    const response = await httpClient.get<{ success: boolean; data: ExamSubject }>(`/exam-subject/${id}`);
    return response.data.data;
  },

  getSubjectsByExam: async (examId: string): Promise<ExamSubject[]> => {
    const response = await httpClient.get<{ success: boolean; data: ExamSubject[] }>(`/exam-subject/by-exam/${examId}`);
    return response.data.data;
  },

  create: async (data: CreateExamSubjectInput): Promise<ExamSubject> => {
    const response = await httpClient.post<{ success: boolean; data: ExamSubject }>("/exam-subject", data);
    return response.data.data;
  },

  update: async (id: string, data: UpdateExamSubjectInput): Promise<ExamSubject> => {
    const response = await httpClient.patch<{ success: boolean; data: ExamSubject }>(`/exam-subject/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.delete(`/exam-subject/${id}`);
  },
};
