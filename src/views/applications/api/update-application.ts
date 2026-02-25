import { api } from "@/core";

import type { ApplicationFormData } from "../dtos/request/application.schema";
import type { ApplicationResponse } from "../dtos/response/application.response";

export async function updateApplication(
  id: number,
  data: Partial<ApplicationFormData>,
): Promise<ApplicationResponse> {
  const response = await api.put<ApplicationResponse>(`/applications/${id}`, data);
  return response.data;
}
