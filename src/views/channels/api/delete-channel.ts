import { api } from "@/core";

export async function deleteChannel(id: number): Promise<void> {
  await api.delete(`/channels/${id}`);
}
