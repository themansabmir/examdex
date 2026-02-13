import { httpClient } from "../../../infrastructure/http/client";
import type { SubjectChapter, CreateSubjectChapterInput, UpdateSubjectChapterInput } from "../domain/SubjectChapter";

export const subjectChapterApi = {
  getAll: async (): Promise<SubjectChapter[]> => {
    const response = await httpClient.get<{ success: boolean; data: SubjectChapter[] }>("/subject-chapter");
    return response.data.data;
  },

  getById: async (id: string): Promise<SubjectChapter> => {
    const response = await httpClient.get<{ success: boolean; data: SubjectChapter }>(`/subject-chapter/${id}`);
    return response.data.data;
  },

  getChaptersByExamSubject: async (examSubjectId: string): Promise<SubjectChapter[]> => {
    const response = await httpClient.get<{ success: boolean; data: SubjectChapter[] }>(`/subject-chapter/by-exam-subject/${examSubjectId}`);
    return response.data.data;
  },

  create: async (data: CreateSubjectChapterInput): Promise<SubjectChapter> => {
    const response = await httpClient.post<{ success: boolean; data: SubjectChapter }>("/subject-chapter", data);
    return response.data.data;
  },

  update: async (id: string, data: UpdateSubjectChapterInput): Promise<SubjectChapter> => {
    const response = await httpClient.patch<{ success: boolean; data: SubjectChapter }>(`/subject-chapter/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.delete(`/subject-chapter/${id}`);
  },
};
