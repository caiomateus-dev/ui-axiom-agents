import axios from "axios";

import type { ChatResponse } from "../dtos/response/chat.response";

export interface SendBufferPayload {
  agentId: number;
  apiKey: string;
  text?: string;
  sessionId?: string;
  externalRef?: string;
  image?: File;
  audio?: Blob;
  file?: File;
}

/** Sends to /agents/chat-buffer using X-API-Key auth (not JWT).
 *  Returns immediately with session_id — response arrives later via webhook/polling. */
export async function sendMessageBuffer(payload: SendBufferPayload): Promise<ChatResponse> {
  const baseURL = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:3000";
  const formData = new FormData();
  formData.append("agent_id", String(payload.agentId));
  if (payload.text) formData.append("text", payload.text);
  if (payload.sessionId) formData.append("session_id", payload.sessionId);
  if (payload.externalRef) formData.append("external_ref", payload.externalRef);
  if (payload.image) formData.append("image", payload.image, payload.image.name);
  if (payload.audio) {
    const ext = payload.audio.type.includes("webm") ? "webm" : "ogg";
    formData.append("audio", payload.audio, `recording.${ext}`);
  }
  if (payload.file) formData.append("file", payload.file, payload.file.name);
  formData.append("test_mode", "true");

  const response = await axios.post<ChatResponse>(`${baseURL}/agents/chat-buffer`, formData, {
    headers: { "X-API-Key": payload.apiKey },
  });
  return response.data;
}
