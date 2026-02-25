import { api } from "@/core";

import type { UserListResponse } from "../dtos/response/user.response";

export async function listUsers(
  page: number,
  limit: number,
  search?: string,
): Promise<UserListResponse> {
  const params: Record<string, string | number> = { page, limit };
  if (search) {
    params.search = search;
  }
  const response = await api.get<UserListResponse>("/users", { params });
  return response.data;
}
