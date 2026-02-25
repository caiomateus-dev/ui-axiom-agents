import { api } from "@/core";

export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/users/${id}`);
}
