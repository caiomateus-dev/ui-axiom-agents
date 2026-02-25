import { api } from "@/core";

import type { UserResponse } from "../dtos/response/user.response";

export async function unblockUser(id: number): Promise<UserResponse> {
  const response = await api.put<UserResponse>(`/users/${id}/unblock`);
  return response.data;
}
