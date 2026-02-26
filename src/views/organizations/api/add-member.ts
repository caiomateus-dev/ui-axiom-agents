import { api } from "@/core";

import type { OrganizationMemberResponse } from "../dtos/response/organization.response";

export async function addMember(
  orgId: number,
  data: { user_id: number; role: string },
): Promise<OrganizationMemberResponse> {
  const response = await api.post<OrganizationMemberResponse>(
    `/organizations/${orgId}/members`,
    data,
  );
  return response.data;
}
