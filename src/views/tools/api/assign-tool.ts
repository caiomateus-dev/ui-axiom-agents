import { api } from "@/core";

export async function assignTool(agentId: number, toolId: number): Promise<void> {
  await api.post(`/tools/agent/${agentId}/assign`, { tool_id: toolId });
}

export async function removeTool(agentId: number, toolId: number): Promise<void> {
  await api.post(`/tools/agent/${agentId}/remove`, { tool_id: toolId });
}
