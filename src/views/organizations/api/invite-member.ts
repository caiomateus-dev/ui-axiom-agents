import { api } from "@/core";

import type { InviteMemberFormData } from "../dtos/request/organization.schema";
import type { OrganizationMemberResponse } from "../dtos/response/organization.response";

export async function inviteMember(
  orgId: number,
  data: InviteMemberFormData,
): Promise<OrganizationMemberResponse> {
  const response = await api.post<OrganizationMemberResponse>(
    `/organizations/${orgId}/members/invite`,
    data,
  );
  return response.data;
}
