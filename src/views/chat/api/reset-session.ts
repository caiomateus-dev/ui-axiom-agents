import axios from "axios";

export async function resetChatSession(
  sessionId: string,
  agentId: number,
  apiKey: string,
): Promise<void> {
  const baseURL = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:3000";
  await axios.post(
    `${baseURL}/agents/chat/reset`,
    { session_id: sessionId, agent_id: agentId },
    { headers: { "X-API-Key": apiKey } },
  );
}
