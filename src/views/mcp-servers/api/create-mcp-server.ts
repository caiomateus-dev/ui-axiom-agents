import { api } from "@/core";

import type { McpServerFormData } from "../dtos/request/mcp-server.schema";
import type { McpServerResponse } from "../dtos/response/mcp-server.response";

export async function createMcpServer(data: McpServerFormData): Promise<McpServerResponse> {
  const response = await api.post<McpServerResponse>("/mcp-servers", data);
  return response.data;
}
