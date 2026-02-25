import { api } from "@/core";

export async function deleteVectorStore(id: number): Promise<void> {
  await api.delete(`/vector-stores/${id}`);
}
