import { api } from "@/core";

import type { ApiKeyFormData } from "../dtos/request/api-key.schema";
import type { ApiKeyResponse } from "../dtos/response/api-key.response";

export async function createApiKey(data: ApiKeyFormData): Promise<ApiKeyResponse> {
  const response = await api.post<ApiKeyResponse>("/api-keys", data);
  return response.data;
}
