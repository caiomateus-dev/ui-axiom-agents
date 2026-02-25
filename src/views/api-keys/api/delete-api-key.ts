import { api } from "@/core";

export async function deleteApiKey(id: number): Promise<void> {
  await api.delete(`/api-keys/${id}`);
}
