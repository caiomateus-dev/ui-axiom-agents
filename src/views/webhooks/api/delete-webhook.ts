import { api } from "@/core";

export async function deleteWebhook(id: number): Promise<void> {
  await api.delete(`/webhooks/${id}`);
}
