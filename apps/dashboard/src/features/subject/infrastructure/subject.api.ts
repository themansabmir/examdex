import { httpClient } from "../../../infrastructure/http/client";
import type { Subject, CreateSubjectInput, UpdateSubjectInput } from "../domain/Subject";

export const subjectApi = {
  getAll: async (params?: { active?: boolean }): Promise<Subject[]> => {
    const response = await httpClient.get<{ success: boolean; data: Subject[] }>("/subjects", { params });
    return response.data.data;
  },

  getById: async (id: string): Promise<Subject> => {
    const response = await httpClient.get<{ success: boolean; data: Subject }>(`/subjects/${id}`);
    return response.data.data;
  },

  create: async (data: CreateSubjectInput): Promise<Subject> => {
    const response = await httpClient.post<{ success: boolean; data: Subject }>("/subjects", data);
    return response.data.data;
  },

  update: async (id: string, data: UpdateSubjectInput): Promise<Subject> => {
    const response = await httpClient.put<{ success: boolean; data: Subject }>(`/subjects/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.delete(`/subjects/${id}`);
  },
};
