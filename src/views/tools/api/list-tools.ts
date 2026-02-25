import { api } from "@/core";

import type { ToolResponse } from "../dtos/response/tool.response";

export async function listTools(): Promise<ToolResponse[]> {
  const response = await api.get<ToolResponse[]>("/tools");
  return response.data;
}
