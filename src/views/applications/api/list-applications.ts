import { api } from "@/core";

import type { ApplicationResponse } from "../dtos/response/application.response";

export async function listApplications(): Promise<ApplicationResponse[]> {
  const response = await api.get<ApplicationResponse[]>("/applications");
  return response.data;
}
