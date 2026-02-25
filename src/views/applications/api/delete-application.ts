import { api } from "@/core";

export async function deleteApplication(id: number): Promise<void> {
  await api.delete(`/applications/${id}`);
}
