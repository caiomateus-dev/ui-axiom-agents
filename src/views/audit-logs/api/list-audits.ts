import { api } from "@/core";

import type { AuditListResponse } from "../dtos/response/audit.response";

export interface AuditFilters {
  agent_name?: string;
  event_type?: string;
  session_id?: number;
  page?: number;
  limit?: number;
}

export async function listAudits(filters: AuditFilters = {}): Promise<AuditListResponse> {
  const response = await api.get<AuditListResponse>("/audits", { params: filters });
  return response.data;
}
