import { api } from "@/core";

import type { PromptFormData } from "../dtos/request/prompt.schema";
import type { PromptResponse } from "../dtos/response/prompt.response";

export async function createPrompt(data: PromptFormData): Promise<PromptResponse> {
  const response = await api.post<PromptResponse>("/prompts", data);
  return response.data;
}
