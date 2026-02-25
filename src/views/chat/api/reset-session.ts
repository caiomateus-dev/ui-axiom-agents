import { api } from "@/core";

export async function resetChatSession(sessionId: string, agentId: number): Promise<void> {
  await api.post("/agents/chat/reset", { session_id: sessionId, agent_id: agentId });
}
