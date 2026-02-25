import { api } from "@/core";

import type { VectorStoreResponse } from "../dtos/response/vector-store.response";

export async function createVectorStore(formData: FormData): Promise<VectorStoreResponse> {
  const response = await api.post<VectorStoreResponse>("/vector-stores", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}
