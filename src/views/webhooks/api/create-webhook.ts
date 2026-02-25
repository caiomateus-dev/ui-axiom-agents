import { api } from "@/core";

import type { WebhookFormData } from "../dtos/request/webhook.schema";
import type { WebhookResponse } from "../dtos/response/webhook.response";

export async function createWebhook(
  applicationId: number,
  data: WebhookFormData,
): Promise<WebhookResponse> {
  const response = await api.post<WebhookResponse>(
    `/webhooks/application/${applicationId}`,
    data,
  );
  return response.data;
}
