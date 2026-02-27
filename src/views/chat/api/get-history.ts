import axios from "axios";

import type { ChatSessionResponse } from "../dtos/response/chat.response";

export async function getChatHistory(
  sessionId: string,
  apiKey: string,
): Promise<ChatSessionResponse> {
  const baseURL = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:3000";
  const response = await axios.get<ChatSessionResponse>(`${baseURL}/agents/chat/history`, {
    params: { session_id: sessionId },
    headers: { "X-API-Key": apiKey },
  });
  return response.data;
}
