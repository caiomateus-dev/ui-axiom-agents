import { api } from "@/core";

export interface AgentMcpLinkResponse {
  id: number;
  mcp_server_id: number;
  agent_id: number;
  mcp_name: string;
  connection_type_code: string;
  config: Record<string, unknown>;
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export async function listAgentMcpLinks(agentId: number): Promise<AgentMcpLinkResponse[]> {
  const response = await api.get<AgentMcpLinkResponse[]>(`/mcp-servers/agents/${agentId}/links`);
  return response.data;
}
