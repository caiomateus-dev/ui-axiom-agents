import { api } from "@/core";

export async function removeMember(orgId: number, userId: number): Promise<void> {
  await api.delete(`/organizations/${orgId}/members/${userId}`);
}
