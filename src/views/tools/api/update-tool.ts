import { api } from "@/core";

import type { ToolResponse } from "../dtos/response/tool.response";

export async function updateTool(
  id: number,
  data: { name?: string; description?: string; is_active?: boolean },
): Promise<ToolResponse> {
  const response = await api.put<ToolResponse>(`/tools/${id}`, data);
  return response.data;
}
