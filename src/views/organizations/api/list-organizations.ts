import { api } from "@/core";

import type { OrganizationResponse } from "../dtos/response/organization.response";

export async function listOrganizations(): Promise<OrganizationResponse[]> {
  const response = await api.get<OrganizationResponse[]>("/organizations");
  return response.data;
}
