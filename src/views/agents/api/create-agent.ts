import { api } from "@/core";

import type { AgentFormData } from "../dtos/request/agent.schema";
import type { AgentResponse } from "../dtos/response/agent.response";

export async function createAgent(
  data: AgentFormData,
  organizationId?: number,
): Promise<AgentResponse> {
  const config = organizationId
    ? { headers: { "X-Organization-Id": String(organizationId) } }
    : undefined;
  const response = await api.post<AgentResponse>("/agents", data, config);
  return response.data;
}
