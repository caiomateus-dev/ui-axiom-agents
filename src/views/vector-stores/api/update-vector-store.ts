import { api } from "@/core";

import type { VectorStoreResponse } from "../dtos/response/vector-store.response";

export async function updateVectorStore(
  id: number,
  data: FormData,
): Promise<VectorStoreResponse> {
  const response = await api.put<VectorStoreResponse>(`/vector-stores/${id}`, data);
  return response.data;
}
