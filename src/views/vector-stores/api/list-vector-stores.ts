import { api } from "@/core";

import type { VectorStoreResponse } from "../dtos/response/vector-store.response";

export async function listVectorStores(): Promise<VectorStoreResponse[]> {
  const response = await api.get<VectorStoreResponse[]>("/vector-stores");
  return response.data;
}
