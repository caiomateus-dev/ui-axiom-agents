import { api } from "@/core";

import type { AuditStatsResponse } from "../dtos/response/audit.response";

export async function getAuditStats(): Promise<AuditStatsResponse> {
  const response = await api.get<AuditStatsResponse>("/audits/stats");
  return response.data;
}
