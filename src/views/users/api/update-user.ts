import { api } from "@/core";

import type { UpdateUserFormData } from "../dtos/request/user.schema";
import type { UserResponse } from "../dtos/response/user.response";

export async function updateUser(
  id: number,
  data: UpdateUserFormData,
): Promise<UserResponse> {
  const response = await api.put<UserResponse>(`/users/${id}`, data);
  return response.data;
}
