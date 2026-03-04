import { api } from "@/core";

import type { AgentMcpLinkResponse } from "./list-agent-mcp-links";

export async function linkMcpToAgent(
  agentId: number,
  mcpServerId: number,
): Promise<AgentMcpLinkResponse> {
  const response = await api.post<AgentMcpLinkResponse>(`/mcp-servers/agents/${agentId}/links`, {
    mcp_server_id: mcpServerId,
  });
  return response.data;
}
