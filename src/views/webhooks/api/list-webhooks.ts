import { api } from "@/core";

import type { WebhookResponse } from "../dtos/response/webhook.response";

export async function listWebhooks(applicationId: number): Promise<WebhookResponse[]> {
  const response = await api.get<WebhookResponse[]>(
    `/webhooks/application/${applicationId}`,
  );
  return response.data;
}
