import { api } from "@/core";

export async function unlinkMcpFromAgent(agentId: number, linkId: number): Promise<void> {
  await api.delete(`/mcp-servers/agents/${agentId}/links/${linkId}`);
}
