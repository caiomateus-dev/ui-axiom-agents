import { api } from "@/core";

export async function deleteOrganization(id: number): Promise<void> {
  await api.delete(`/organizations/${id}`);
}
