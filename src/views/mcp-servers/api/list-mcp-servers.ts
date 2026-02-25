import { api } from "@/core";

import type { McpServerResponse } from "../dtos/response/mcp-server.response";

export async function listMcpServers(): Promise<McpServerResponse[]> {
  const response = await api.get<McpServerResponse[]>("/mcp-servers");
  return response.data;
}
