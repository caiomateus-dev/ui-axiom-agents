import { api } from "@/core";

import type { PromptUpdateFormData } from "../dtos/request/prompt.schema";
import type { PromptResponse } from "../dtos/response/prompt.response";

export async function updatePrompt(
  agentId: number,
  data: PromptUpdateFormData,
): Promise<PromptResponse> {
  const response = await api.put<PromptResponse>(`/prompts/${agentId}`, data);
  return response.data;
}
