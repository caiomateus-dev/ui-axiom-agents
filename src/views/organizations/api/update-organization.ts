import { api } from "@/core";

import type { UpdateOrganizationFormData } from "../dtos/request/organization.schema";

export async function updateOrganization(
  id: number,
  data: UpdateOrganizationFormData,
): Promise<void> {
  await api.put(`/organizations/${id}`, data);
}
