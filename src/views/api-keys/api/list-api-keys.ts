import { api } from "@/core";

import type { ApiKeyResponse } from "../dtos/response/api-key.response";

export async function listApiKeys(applicationId?: number): Promise<ApiKeyResponse[]> {
  const params = applicationId ? { application_id: applicationId } : {};
  const response = await api.get<ApiKeyResponse[]>("/api-keys", { params });
  return response.data;
}
