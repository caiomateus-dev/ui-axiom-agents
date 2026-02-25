import { api } from "@/core";

import type { AgentResponse } from "../dtos/response/agent.response";

export async function listAgents(): Promise<AgentResponse[]> {
  const response = await api.get<AgentResponse[]>("/agents");
  return response.data;
}
