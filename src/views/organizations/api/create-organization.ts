import { api } from "@/core";

import type { CreateOrganizationFormData } from "../dtos/request/organization.schema";
import type { OrganizationResponse } from "../dtos/response/organization.response";

export async function createOrganization(
  data: CreateOrganizationFormData,
): Promise<OrganizationResponse> {
  const response = await api.post<OrganizationResponse>("/organizations", data);
  return response.data;
}
