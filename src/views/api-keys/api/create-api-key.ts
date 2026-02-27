import { api } from "@/core";

import type { ApiKeyFormData } from "../dtos/request/api-key.schema";
import type { ApiKeyResponse } from "../dtos/response/api-key.response";

export async function createApiKey(data: ApiKeyFormData): Promise<ApiKeyResponse> {
  const { application_id, ...rest } = data;
  const response = await api.post<ApiKeyResponse>("/api-keys", {
    ...rest,
    application: application_id,
  });
  return response.data;
}
