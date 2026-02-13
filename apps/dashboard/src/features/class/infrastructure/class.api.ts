import { httpClient } from "../../../infrastructure/http/client";
import type { Class, CreateClassInput, UpdateClassInput } from "../domain/Class";

export const classApi = {
  getAll: async (params?: { active?: boolean }): Promise<Class[]> => {
    const response = await httpClient.get<{ success: boolean; data: Class[] }>("/classes", { params });
    return response.data.data;
  },

  getById: async (id: string): Promise<Class> => {
    const response = await httpClient.get<{ success: boolean; data: Class }>(`/classes/${id}`);
    return response.data.data;
  },

  getByCode: async (code: string): Promise<Class> => {
    const response = await httpClient.get<{ success: boolean; data: Class }>(`/classes/code/${code}`);
    return response.data.data;
  },

  create: async (data: CreateClassInput): Promise<Class> => {
    const response = await httpClient.post<{ success: boolean; data: Class }>("/classes", data);
    return response.data.data;
  },

  update: async (id: string, data: UpdateClassInput): Promise<Class> => {
    const response = await httpClient.patch<{ success: boolean; data: Class }>(`/classes/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.delete(`/classes/${id}`);
  },
};
