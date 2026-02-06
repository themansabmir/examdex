import { httpClient } from "../../../infrastructure/http/client";
import type { Chapter, CreateChapterInput, UpdateChapterInput } from "../domain/Chapter";

export const chapterApi = {
  getAll: async (params?: { active?: boolean; subjectId?: string; classId?: string }): Promise<Chapter[]> => {
    const response = await httpClient.get<{ success: boolean; data: Chapter[] }>("/chapters", { params });
    return response.data.data;
  },

  getById: async (id: string): Promise<Chapter> => {
    const response = await httpClient.get<{ success: boolean; data: Chapter }>(`/chapters/${id}`);
    return response.data.data;
  },

  create: async (data: CreateChapterInput): Promise<Chapter> => {
    const response = await httpClient.post<{ success: boolean; data: Chapter }>("/chapters", data);
    return response.data.data;
  },

  update: async (id: string, data: UpdateChapterInput): Promise<Chapter> => {
    const response = await httpClient.put<{ success: boolean; data: Chapter }>(`/chapters/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.delete(`/chapters/${id}`);
  },
};
