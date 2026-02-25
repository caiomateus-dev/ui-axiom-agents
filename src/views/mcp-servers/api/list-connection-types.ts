import { api } from "@/core";

import type { ConnectionTypeResponse } from "../dtos/response/mcp-server.response";

export async function listConnectionTypes(): Promise<ConnectionTypeResponse[]> {
  const response = await api.get<ConnectionTypeResponse[]>("/mcp-servers/connection-types");
  return response.data;
}
