import axios from "axios";

import type { ChatResponse } from "../dtos/response/chat.response";

export interface SendMessagePayload {
  agentId: number;
  apiKey: string;
  text?: string;
  sessionId?: string;
  image?: File;
  audio?: Blob;
  file?: File;
}

export async function sendMessage(payload: SendMessagePayload): Promise<ChatResponse> {
  const baseURL = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:3000";
  const formData = new FormData();
  formData.append("agent_id", String(payload.agentId));
  if (payload.text) formData.append("text", payload.text);
  if (payload.sessionId) formData.append("session_id", payload.sessionId);
  if (payload.image) formData.append("image", payload.image, payload.image.name);
  if (payload.audio) {
    const ext = payload.audio.type.includes("webm") ? "webm" : "ogg";
    formData.append("audio", payload.audio, `recording.${ext}`);
  }
  if (payload.file) formData.append("file", payload.file, payload.file.name);
  const response = await axios.post<ChatResponse>(`${baseURL}/agents/chat`, formData, {
    headers: { "X-API-Key": payload.apiKey },
  });
  return response.data;
}
