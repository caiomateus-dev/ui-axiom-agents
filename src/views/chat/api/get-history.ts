import { api } from "@/core";

import type { ChatSessionResponse } from "../dtos/response/chat.response";

export async function getChatHistory(sessionId: string): Promise<ChatSessionResponse> {
  const response = await api.get<ChatSessionResponse>("/agents/chat/history", {
    params: { session_id: sessionId },
  });
  return response.data;
}
