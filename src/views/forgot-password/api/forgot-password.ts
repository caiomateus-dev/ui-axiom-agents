import { api } from "@/core";

import type { ForgotPasswordResponse } from "../dtos/response/forgot-password.response";

interface ForgotPasswordPayload {
  email: string;
  redirect_url: string;
}

export async function forgotPasswordRequest(
  data: ForgotPasswordPayload,
): Promise<ForgotPasswordResponse> {
  const response = await api.post<ForgotPasswordResponse>("/auth/forgot-password", data);
  return response.data;
}
