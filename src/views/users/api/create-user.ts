import { api } from "@/core";

import type { CreateUserFormData } from "../dtos/request/user.schema";
import type { UserResponse } from "../dtos/response/user.response";

export async function createUser(data: CreateUserFormData): Promise<UserResponse> {
  const response = await api.post<UserResponse>("/users", data);
  return response.data;
}
