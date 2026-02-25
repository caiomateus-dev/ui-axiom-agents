import { api } from "@/core";

import type { ChatResponse } from "../dtos/response/chat.response";

export async function sendMessage(
  agentId: number,
  text: string,
  sessionId?: string,
): Promise<ChatResponse> {
  const formData = new FormData();
  formData.append("agent_id", String(agentId));
  formData.append("text", text);
  if (sessionId) {
    formData.append("session_id", sessionId);
  }
  const response = await api.post<ChatResponse>("/agents/chat", formData);
  return response.data;
}
