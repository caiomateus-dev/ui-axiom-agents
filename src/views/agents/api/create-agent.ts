import { api } from "@/core";

import type { AgentFormData } from "../dtos/request/agent.schema";
import type { AgentResponse } from "../dtos/response/agent.response";

export async function createAgent(data: AgentFormData): Promise<AgentResponse> {
  const response = await api.post<AgentResponse>("/agents", data);
  return response.data;
}
