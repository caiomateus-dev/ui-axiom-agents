import { api } from "@/core";

import type { ApplicationFormData } from "../dtos/request/application.schema";
import type { ApplicationResponse } from "../dtos/response/application.response";

export async function createApplication(
  data: ApplicationFormData,
  organizationId?: number,
): Promise<ApplicationResponse> {
  const config = organizationId
    ? { headers: { "X-Organization-Id": String(organizationId) } }
    : undefined;
  const response = await api.post<ApplicationResponse>("/applications", data, config);
  return response.data;
}
