import { api } from "@/core";

export async function deleteMcpServer(id: number): Promise<void> {
  await api.delete(`/mcp-servers/${id}`);
}
