import { api } from "@/core";

export async function connectChannel(id: number): Promise<void> {
  await api.post(`/channels/${id}/connect`);
}

export async function disconnectChannel(id: number): Promise<void> {
  await api.post(`/channels/${id}/disconnect`);
}
