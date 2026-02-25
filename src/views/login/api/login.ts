import { api } from "@/core";

import type { LoginFormData } from "../dtos/request/login.schema";
import type { LoginResponse } from "../dtos/response/login.response";

export async function loginRequest(data: LoginFormData): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/auth/login", data);
  return response.data;
}
