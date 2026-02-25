import { api } from "@/core";

import type { AgentResponse } from "../dtos/response/agent.response";

export async function getAgent(id: number): Promise<AgentResponse> {
  const response = await api.get<AgentResponse>(`/agents/${id}`);
  return response.data;
}
