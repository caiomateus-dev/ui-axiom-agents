import { api } from "@/core";

import type { PromptResponse } from "../dtos/response/prompt.response";

export async function listPrompts(): Promise<PromptResponse[]> {
  const response = await api.get<PromptResponse[]>("/prompts");
  return response.data;
}
