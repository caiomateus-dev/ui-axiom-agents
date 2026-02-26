import { api } from "@/core";

import type { OrganizationMemberResponse } from "../dtos/response/organization.response";

export async function listMembers(orgId: number): Promise<OrganizationMemberResponse[]> {
  const response = await api.get<OrganizationMemberResponse[]>(`/organizations/${orgId}/members`);
  return response.data;
}
