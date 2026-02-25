import { api } from "@/core";

import type { UserResponse } from "../dtos/response/user.response";

export async function blockUser(id: number): Promise<UserResponse> {
  const response = await api.put<UserResponse>(`/users/${id}/block`);
  return response.data;
}
