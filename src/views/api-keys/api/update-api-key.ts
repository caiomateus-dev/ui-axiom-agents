import { api } from "@/core";

import type { ApiKeyFormData } from "../dtos/request/api-key.schema";
import type { ApiKeyResponse } from "../dtos/response/api-key.response";

export async function updateApiKey(
  id: number,
  data: Partial<ApiKeyFormData>,
): Promise<ApiKeyResponse> {
  const response = await api.put<ApiKeyResponse>(`/api-keys/${id}`, data);
  return response.data;
}
