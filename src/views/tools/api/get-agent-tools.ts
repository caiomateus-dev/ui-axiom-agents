import { api } from "@/core";

import type { AgentToolResponse } from "../dtos/response/tool.response";

export async function getAgentTools(agentId: number): Promise<AgentToolResponse[]> {
  const response = await api.get<AgentToolResponse[]>(`/tools/agent/${agentId}`);
  return response.data;
}
