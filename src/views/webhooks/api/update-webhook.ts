import { api } from "@/core";

import type { WebhookFormData } from "../dtos/request/webhook.schema";
import type { WebhookResponse } from "../dtos/response/webhook.response";

export async function updateWebhook(id: number, data: Partial<WebhookFormData>): Promise<WebhookResponse> {
  const response = await api.put<WebhookResponse>(`/webhooks/${id}`, data);
  return response.data;
}
