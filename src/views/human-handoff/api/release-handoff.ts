import { api } from "@/core";

import type { ReleaseHandoffResponse } from "../dtos/response/handoff.response";

export interface ReleaseHandoffPayload {
  agentId: number;
  sessionId?: string;
  externalRef?: string;
}

export async function releaseHandoffSession(
  payload: ReleaseHandoffPayload,
): Promise<ReleaseHandoffResponse> {
  const response = await api.post<ReleaseHandoffResponse>("/admin/chat/handoff/release", {
    agent_id: payload.agentId,
    session_id: payload.sessionId,
    external_ref: payload.externalRef,
  });
  return response.data;
}
