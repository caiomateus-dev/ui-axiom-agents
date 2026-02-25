import { api } from "@/core";

export async function deletePrompt(agentId: number): Promise<void> {
  await api.delete(`/prompts/${agentId}`);
}
