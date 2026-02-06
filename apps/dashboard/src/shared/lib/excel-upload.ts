import { httpClient } from "@/infrastructure/http/client";

export async function uploadExcel(moduleName: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await httpClient.post(`/excel/${moduleName}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}
