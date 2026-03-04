import { api } from "@/core";

import type { ListHandoffResponse } from "../dtos/response/handoff.response";

export async function listHandoffSessions(agentName?: string): Promise<ListHandoffResponse> {
  const response = await api.get<ListHandoffResponse>("/admin/chat/handoff/list", {
    params: agentName ? { agent_name: agentName } : undefined,
  });
  return response.data;
}
