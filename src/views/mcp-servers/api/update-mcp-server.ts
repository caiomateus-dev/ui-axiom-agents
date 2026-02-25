import { api } from "@/core";

import type { McpServerFormData } from "../dtos/request/mcp-server.schema";
import type { McpServerResponse } from "../dtos/response/mcp-server.response";

export async function updateMcpServer(
  id: number,
  data: Partial<McpServerFormData>,
): Promise<McpServerResponse> {
  const response = await api.put<McpServerResponse>(`/mcp-servers/${id}`, data);
  return response.data;
}
