import { api } from "@/core";

import type { ApplicationFormData } from "../dtos/request/application.schema";
import type { ApplicationResponse } from "../dtos/response/application.response";

export async function createApplication(data: ApplicationFormData): Promise<ApplicationResponse> {
  const response = await api.post<ApplicationResponse>("/applications", data);
  return response.data;
}
