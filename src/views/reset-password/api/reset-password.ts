import { api } from "@/core";

import type { ResetPasswordResponse } from "../dtos/response/reset-password.response";

interface ResetPasswordPayload {
  token: string;
  new_password: string;
  confirm_password: string;
}

export async function resetPasswordRequest(
  data: ResetPasswordPayload,
): Promise<ResetPasswordResponse> {
  const response = await api.post<ResetPasswordResponse>("/auth/reset-password", data);
  return response.data;
}
